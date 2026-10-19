# Vite React Better Auth Boilerplate
A full-stack TypeScript boilerplate using Vite, React, TanStack Router, TanStack Table, Better Auth, MongoDB, Express, and Tailwind CSS.
<img width="1536" height="1024" alt="vite-react-better-auth-boilerplate" src="https://github.com/user-attachments/assets/bd67de70-8d3c-437e-aa68-7fa7cdbe3af2" />
## Features

- Vite + React + TypeScript
- Tailwind CSS
- TanStack Router
- TanStack Table example
- Better Auth integration
- Email/password authentication
- Google OAuth authentication
- MongoDB adapter
- Express backend for auth routes
- Protected dashboard route
- Header, footer, and sign-out flow
- Typecheck and lint-ready setup

## Pages

### `/sign-in`

- Google sign-in
- Email/password sign-in
- Password minimum length validation

### `/sign-up`

- Google sign-up
- Email/password sign-up
- Password minimum length validation

### `/dashboard`

Protected page requiring an active session.

Includes:

- Header
- Sample TanStack Table
- Footer
- Sign-out button

## Tech Stack

| Tool | Purpose |
|---|---|
| Vite | Frontend build tool |
| React | UI library |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| TanStack Router | File/code-based routing |
| TanStack Table | Table rendering |
| Better Auth | Authentication |
| MongoDB | Database |
| Express | Backend auth server |

## Project Structure

```txt
.
├── server
│   ├── index.ts
│   └── auth.ts
├── src
│   ├── components
│   │   ├── auth-form.tsx
│   │   └── users-table.tsx
│   ├── lib
│   │   └── auth-client.ts
│   ├── pages
│   │   ├── auth-pages.tsx
│   │   └── dashboard-page.tsx
│   ├── router.tsx
│   ├── index.css
│   └── main.tsx
├── .env.example
├── package.json
├── postcss.config.js
├── tailwind.config.ts
├── vite.config.ts
└── README.md
```

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/vite-react-better-auth-boilerplate.git
cd vite-react-better-auth-boilerplate
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create environment file

```bash
cp .env.example .env
```

On Windows, you can create `.env` manually and copy the values from `.env.example`.

### 4. Configure environment variables

```env
MONGODB_URI=mongodb://localhost:27017/better-auth

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000
```

### 5. Start MongoDB

Make sure MongoDB is running locally, or update `MONGODB_URI` to use MongoDB Atlas.

### 6. Run the app

```bash
npm run dev
```

This starts the frontend and backend together.

## Auth Routes

Better Auth runs on the Express server at:

```txt
http://localhost:3000/api/auth/*
```

Vite proxies `/api` requests to the backend server.

## Google OAuth Setup

Create OAuth credentials in Google Cloud Console.

Use this redirect URI:

```txt
http://localhost:3000/api/auth/callback/google
```

Then add the credentials to `.env`:

```env
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

## Scripts

```bash
npm run dev
```

Run client and server together.

```bash
npm run typecheck
```

Run TypeScript checks.

```bash
npm run lint
```

Run ESLint.

```bash
npm run build
```

Build the project.

## Validation

The project has been validated with:

```bash
npm run typecheck
npm run lint
```

Current status:

- Typecheck passes
- Lint passes
- One non-blocking TanStack Table / React compiler warning may appear


## Roadmap

- Role-based access control
- Email verification
- Password reset
- Dark mode
- User profile page
- Docker setup
- Test setup
- Deployment guide
- CI workflow

## License

MIT
