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

Create `.env` files:

`server.env`
```
DATABASE_URL=postgresql://postgres:postgres@db:5432/eazy_lingo
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_CALLBACK_URL=https://your-domain.com/api/auth/google/redirect
JWT_SECRET=...
JWT_REFRESH_SECRET=...
DEMO_USER_EMAIL=demo@eazy-lingo.dev
```

`client.env`
```
NEXT_PUBLIC_API_BASE_URL=https://your-domain.com/api
```

> Replace placeholders with real values. For production, generate random JWT secrets and configure a production OAuth client.

## 5. Compose file for EC2
Create `docker-compose.ec2.yml`:

```yaml
services:
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: eazy_lingo
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

  server:
    image: ghcr.io/<owner>/eazy-lingo-server:latest
    env_file:
      - server.env
    environment:
      DATABASE_URL: postgresql://postgres:postgres@db:5432/eazy_lingo
      NODE_ENV: production
    depends_on:
      db:
        condition: service_healthy
    ports:
      - "4000:4000"
    healthcheck:
      test: ["CMD-SHELL", "curl -fsS http://localhost:4000/api/health || exit 1"]
      interval: 10s
      timeout: 5s
      retries: 5
    command: >
      sh -c "pnpm --filter @eazy-lingo/server exec prisma migrate deploy &&
             pnpm --filter @eazy-lingo/server exec prisma db seed &&
             node dist/main.js"

  client:
    image: ghcr.io/<owner>/eazy-lingo-client:latest
    env_file:
      - client.env
    environment:
      NEXT_PUBLIC_API_BASE_URL: https://your-domain.com/api
      NODE_ENV: production
    depends_on:
      - server
    ports:
      - "3000:3000"
    command: ["pnpm", "--filter", "@eazy-lingo/client", "start"]

volumes:
  pgdata:
```

Replace `<owner>` with your GitHub user or organization.

## 6. Authenticate to GHCR
Log in using a GitHub Personal Access Token (with `read:packages` scope) or the built-in GitHub token if using GitHub Actions self-hosted runner:

```bash
echo "<PAT>" | docker login ghcr.io -u <github-username> --password-stdin
```

Store credentials securely. Consider using AWS Secrets Manager or SSM Parameter Store.

## 7. Deploy

```bash
cd /opt/eazy-lingo
docker compose -f docker-compose.ec2.yml pull
docker compose -f docker-compose.ec2.yml up -d
```

Verify:

```bash
docker compose -f docker-compose.ec2.yml ps
curl http://<ec2-ip>:4000/api/health
curl http://<ec2-ip>:3000
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

> Ensure `docker-compose.ec2.yml` exists on the EC2 host along with `server.env` and `client.env`.

## 8. Updates & rollbacks

To update to a new version (latest tag):

```bash
docker compose -f docker-compose.ec2.yml pull
docker compose -f docker-compose.ec2.yml up -d
```

To deploy a specific commit:

```bash
sed -i 's/latest/<commit-sha>/' docker-compose.ec2.yml
docker compose -f docker-compose.ec2.yml pull
docker compose -f docker-compose.ec2.yml up -d
```

Keep previous tags to allow quick rollback.

## 9. Optional enhancements
- Use AWS RDS instead of containerized Postgres for durability.
- Add Nginx/Traefik reverse proxy with HTTPS (ACM + ALB or Let's Encrypt via certbot).
- Automate provisioning via Terraform (EC2, security group, IAM role) and incorporate into CI/CD pipeline.
- Configure CloudWatch Logs by mounting log drivers or using `awslogs`.
- Set up systemd unit or cron job to run health checks and alert on failures.
