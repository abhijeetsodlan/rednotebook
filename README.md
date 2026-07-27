# Red Notebook

A dark, Che Guevara / Bhagat Singh inspired personal blog platform built as a single Next.js App Router project. Admin-only work stays server-side through Route Handlers, middleware, signed httpOnly cookies, bcrypt password verification, and Prisma + SQLite.

## Stack

- Next.js 14 App Router + TypeScript
- Tailwind CSS
- Prisma + SQLite
- `jose` signed JWT session cookie
- `bcryptjs` password hash verification
- `react-markdown`, `remark-gfm`, and `rehype-sanitize`

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env` from `.env.example`:

```bash
cp .env.example .env
```

3. Generate a bcrypt hash for your admin password:

```bash
npm run hash-password
```

4. Put the generated hash into `ADMIN_PASSWORD_HASH`, set `ADMIN_USERNAME`, and set a random `SESSION_SECRET` of at least 32 characters.

5. Create the SQLite database:

```bash
npm run prisma:migrate -- --name init
```

6. Run the app:

```bash
npm run dev
```

Open `http://localhost:3000`, and use `/admin/login` for post and notice management.

## Deployment Notes

- Set `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH`, `SESSION_SECRET`, `DATABASE_URL`, and optionally `NEXT_PUBLIC_SITE_URL` in your host.
- SQLite is file-based. On Vercel, persistent writes require a persistent volume or a hosted database. For fully reliable Vercel production, switch Prisma to a hosted database provider or use the MDX-in-repo publishing model.
- Keep `.env` out of git. Only `.env.example` should be committed.

## Security

- Admin credentials are never shipped to the browser.
- Admin pages and mutating post/notice routes are protected by `middleware.ts`.
- Login is rate-limited in memory to slow repeated attempts.
- Markdown is rendered through `rehype-sanitize` to reduce XSS risk.
- The session cookie is httpOnly, sameSite=strict, and secure in production.
