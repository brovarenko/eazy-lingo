# Environment Variables

Copy the blocks below into `client/.env` and `server/.env`, replacing the placeholder values with real secrets for your environment.

## Client (`client/.env`)

```
# Public base URL for the API gateway used by the Next.js app
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000/api
```

## Server (`server/.env`)

```
# Google OAuth credentials (create a client in Google Cloud Console)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# JWT signing secrets (use long random strings)
JWT_SECRET=replace-with-strong-secret
JWT_REFRESH_SECRET=replace-with-strong-refresh-secret

# PostgreSQL connection string (adjust user/password/host/dbname as needed)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/eazy_lingo
```

> Keep the real `.env` files out of version control. Use this document as the canonical reference for required variables.
