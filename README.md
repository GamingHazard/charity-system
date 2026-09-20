# Charity System Dashboard

Standalone administration dashboard for Seeds of Love Foundation.

## Development

```powershell
pnpm install --ignore-scripts --ignore-workspace
pnpm dev -- --port 3001
```

Open `http://localhost:3001/login`.

Set `NEXT_PUBLIC_API_BASE_URL` to the shared backend API. The dashboard expects the backend to issue an HttpOnly session cookie from the admin login endpoint and provide `/auth/admin/me` and `/auth/admin/logout` endpoints. Configure backend CORS and credentials for the dashboard origin.

## Routes

- `/login`
- `/dashboard`
- `/dashboard/children`
- `/dashboard/sponsorships`
- `/dashboard/staff`
- `/dashboard/blogs`
- `/dashboard/gallery`
- `/dashboard/events`
- `/dashboard/content`
