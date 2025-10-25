# AWS EC2 Deployment Guide

This document describes how to deploy Eazy Lingo on an Ubuntu-based EC2 instance using Docker Compose and images published to GitHub Container Registry (GHCR).

## 1. Prerequisites
- AWS account with permissions to create EC2 instances, security groups, and optionally IAM roles.
- Existing GHCR publishing workflow (`docker-publish.yml`) creating images `ghcr.io/<owner>/eazy-lingo-{client,server}`.
- Domain (optional) and DNS access if you want to expose HTTPS.
- Local machine with AWS CLI v2 installed.

## 2. Provision the EC2 instance
1. Launch an instance (e.g., `t3.small`, Ubuntu 22.04 LTS).
2. Security group rules:
   - Inbound TCP 22 (SSH) from your IP.
   - Inbound TCP 80/443 (for HTTP/HTTPS).
   - Inbound TCP 3000/4000 optional (only if you expose the raw container ports).
3. Attach an IAM role with permissions to read GHCR (optional, you can use PAT/git token instead).
4. Associate an Elastic IP if you need a stable address.

## 3. Bootstrap script (cloud-init)
Add the following user data when creating the instance to preinstall Docker & Compose:

```bash
#!/bin/bash
set -eux
apt-get update
apt-get install -y ca-certificates curl gnupg lsb-release
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
apt-get update
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
systemctl enable --now docker
usermod -aG docker ubuntu
```

After startup, re-login via SSH to pick up the docker group membership.

## 4. Prepare server configuration
On the instance:

```bash
sudo mkdir -p /opt/eazy-lingo
sudo chown ubuntu:ubuntu /opt/eazy-lingo
cd /opt/eazy-lingo
```

Clone (or pull) the repository so the compose files stay in sync:

```bash
git clone git@github.com:<owner>/eazy-lingo.git .
# or: git fetch origin main && git reset --hard origin/main
```

Copy the example env file and fill in real secrets, then prepare directories for certificates:

```bash
cp .env.production.example .env.production
nano .env.production   # or your editor of choice
mkdir -p .certbot/etc .certbot/www
```

`/.env.production`
```
IMAGE_OWNER=<github-user-or-org>
SERVER_IMAGE_TAG=latest
CLIENT_IMAGE_TAG=latest
DATABASE_URL=postgresql://postgres:postgres@db:5432/eazy_lingo
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_CALLBACK_URL=https://your-domain.com/api/auth/google/redirect
CLIENT_APP_URL=https://your-domain.com
NEXT_PUBLIC_API_BASE_URL=https://your-domain.com/api
JWT_SECRET=...
JWT_REFRESH_SECRET=...
```

> Replace placeholders with real values. For production, generate random JWT secrets and configure a production OAuth client. Keep `.env.production` (and `.certbot/`) out of version control—they are ignored via `.gitignore`.

## 5. Issue HTTPS certificates
TLS terminates inside the nginx container, so Let's Encrypt certs must be available before you start it:

```bash
cd /opt/eazy-lingo
# Ensure nothing else listens on port 80 while requesting the cert.
docker run --rm -it \
  -p 80:80 \
  -v "$PWD/.certbot/etc:/etc/letsencrypt" \
  -v "$PWD/.certbot/www:/var/www/certbot" \
  certbot/certbot certonly \
  --standalone \
  -d app.example.com
```

Replace `app.example.com` with your domain. After success, certificates live in `.certbot/etc/live/app.example.com/`. Renew monthly via:

```bash
docker run --rm -it \
  -v "$PWD/.certbot/etc:/etc/letsencrypt" \
  -v "$PWD/.certbot/www:/var/www/certbot" \
  certbot/certbot renew && \
  docker compose --env-file .env.production -f docker-compose.prod.yml exec nginx nginx -s reload
```

## 6. Compose file for EC2
The repository now ships `docker-compose.prod.yml`, so you no longer need a hand-crafted `docker-compose.yml` on the server. The file defines:

- `db`: Postgres 15 with a persistent `pgdata` volume.
- `server`: pulls `ghcr.io/${IMAGE_OWNER}/eazy-lingo-server:${SERVER_IMAGE_TAG:-latest}` and wires health checks plus OAuth secrets from `.env.production`.
- `client`: pulls the matching client image and forwards `NEXT_PUBLIC_API_BASE_URL`.

Because the file lives in git, removing stray copies on the EC2 host is safe—just `git pull` to pick up changes.

## 7. Authenticate to GHCR
Log in using a GitHub Personal Access Token (with `read:packages` scope) or the built-in GitHub token if using GitHub Actions self-hosted runner:

```bash
echo "<PAT>" | docker login ghcr.io -u <github-username> --password-stdin
```

Store credentials securely. Consider using AWS Secrets Manager or SSM Parameter Store.

## 8. Deploy

```bash
cd /opt/eazy-lingo
docker compose --env-file .env.production -f docker-compose.prod.yml pull
docker compose --env-file .env.production -f docker-compose.prod.yml up -d
```

Verify:

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml ps
curl -I https://app.example.com/api/health
curl -I https://app.example.com
```

### Optional: deploy via helper script

From your local machine (repository root):

```bash
export GITHUB_OWNER=<github-user-or-org>
scripts/deploy-ec2.sh ubuntu@<ec2-ip-or-hostname>
```

Environment variables:
- `SERVER_IMAGE_TAG` / `CLIENT_IMAGE_TAG` to pin specific tags (default `latest`).
- `REMOTE_DIR` to change the remote working directory.
- `SSH_OPTIONS` for custom SSH flags (`-i key.pem`, `-o StrictHostKeyChecking=no`, etc.).

> Ensure `docker-compose.prod.yml` and `.env.production` exist on the EC2 host. Copy `.env.production.example`, fill secrets, and keep the file outside git.

## 9. Updates & rollbacks

To update to a new version (latest tag):

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml pull
docker compose --env-file .env.production -f docker-compose.prod.yml up -d
```

To deploy a specific commit:

```bash
sed -i 's/latest/<commit-sha>/' docker-compose.prod.yml
docker compose --env-file .env.production -f docker-compose.prod.yml pull
docker compose --env-file .env.production -f docker-compose.prod.yml up -d
```

Keep previous tags to allow quick rollback.

## 10. Optional enhancements
- Use AWS RDS instead of containerized Postgres for durability.
- Add Nginx/Traefik reverse proxy with HTTPS (ACM + ALB or Let's Encrypt via certbot).
- Automate provisioning via Terraform (EC2, security group, IAM role) and incorporate into CI/CD pipeline.
- Configure CloudWatch Logs by mounting log drivers or using `awslogs`.
- Set up systemd unit or cron job to run health checks and alert on failures.


