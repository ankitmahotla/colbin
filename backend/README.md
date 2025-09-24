# Recruitment Platform Prototype

This is a recruitment platform prototype backend using Bun, Express, Drizzle ORM, and PostgreSQL with Docker for the database. It provides user registration, login with JWT authentication, and user profile management.

---

## Prerequisites

- Node.js (latest recommended)
- Bun runtime (for backend)
- Docker and Docker Compose (for PostgreSQL)
- PostgreSQL client (optional for DB inspection)

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd <repo-folder>/backend
```

### 2. Configure environment variables

Copy the example environment file and edit as needed:

```bash
cp .env.example .env
```

The `.env` file should contain:
```
PORT=8000
JWT_SECRET=your_jwt_secret_key
DATABASE_URL=postgres://colbinuser:colbinpass@localhost:5432/colbindb
```

Adjust values based on your environment if required.

### 3. Start PostgreSQL with Docker Compose

Bring up the Postgres container:

```bash
npm run db:up
```

or

```bash
bun run db:up
```

To stop:

```bash
npm run db:down
```

To reset (stop, remove data, and recreate):

```bash
npm run db:reset
```

The database will be accessible at `localhost:5432` with credentials:

- User: `colbinuser`
- Password: `colbinpass`
- DB: `colbindb`

### 4. Install backend dependencies

Use Bun or npm/yarn:

```bash
bun install
```

or

```bash
npm install
```

### 5. Start the development server

Run the backend locally with watch mode:

```bash
bun run dev
```

The server will start on `http://localhost:8000`.

---

## Project Structure

```
/backend
├─ src/                 # Backend source code
├─ .env.example         # Example environment variables
├─ docker-compose.yml   # Docker Compose for Postgres
├─ package.json         # Dependencies and scripts
└─ README.md            # Project documentation
/frontend               # Frontend React app (if included)
```

---

## Common Scripts

| Script        | Description                                      |
|---------------|------------------------------------------------|
| `dev`         | Start backend server locally in watch mode     |
| `db:up`       | Start PostgreSQL container with Docker Compose |
| `db:down`     | Stop PostgreSQL container                        |
| `db:reset`    | Stop and remove DB container and volumes, then recreate |

---

## Notes

- The backend uses Drizzle ORM with PostgreSQL for type-safe database operations.
- Authentication uses JWT tokens signed with `JWT_SECRET` and stored client-side.
- Database is containerized to simplify local development and maintain consistency.
- Ensure `bun` runtime is installed if using Bun commands.
- Frontend setup is separate (see frontend README if applicable).
