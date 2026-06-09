# ToniOS

Enterprise-grade SaaS foundation for fast-food restaurant operations.

## Workspace

- `apps/admin-web`: SaaS dashboard shell.
- `apps/pos-web`: POS touch shell prepared for offline-first work.
- `apps/kds-web`: kitchen display shell.
- `apps/api`: NestJS API with a healthcheck.
- `apps/workers`: async worker entrypoint for future event consumers.
- `packages/*`: shared contracts, domain, infrastructure, UI and clients.

## Commands

```bash
pnpm install
pnpm setup:local
pnpm dev
pnpm dev:api
pnpm dev:frontend
pnpm build
pnpm lint
pnpm typecheck
pnpm test
pnpm db:validate
pnpm db:generate
pnpm db:migrate:dev
pnpm db:migrate:deploy
```

## Desarrollo sin Docker

ToniOS can run locally while PostgreSQL, Redis and NATS run on an external physical server.
Docker is not required for day-to-day development.

1. Install dependencies:

```bash
pnpm install
```

2. Create a local environment file:

```bash
cp .env.example .env
```

3. Edit `.env` and point these variables to your external services:

- `DATABASE_URL`: PostgreSQL connection string for the ToniOS development database.
- `REDIS_URL`: external Redis endpoint.
- `NATS_URL`: external NATS endpoint with JetStream enabled.
- `CORS_ORIGIN`: local web origins allowed by the API.
- `NEXT_PUBLIC_API_BASE_URL`: browser-facing API URL used by Next.js apps.

4. Validate and generate Prisma without starting Docker:

```bash
pnpm db:validate
pnpm db:generate
```

5. Run migrations against the external PostgreSQL server:

```bash
pnpm db:migrate:dev
```

Use `pnpm db:migrate:deploy` for staging/production-style migration execution.

6. Start the backend and frontends:

```bash
pnpm dev:api
pnpm dev:frontend
```

You can also start individual web apps:

```bash
pnpm dev:admin
pnpm dev:pos
pnpm dev:kds
```

## Validación En VM Ubuntu

El flujo de validación técnica está pensado para Ubuntu Server 24.04 con Node.js, pnpm,
Git y PostgreSQL 16 instalados. No requiere Docker, WSL ni servicios locales en Windows.

Después de hacer `git pull` en la VM, ejecuta:

```bash
pnpm install
pnpm db:validate
pnpm db:generate
pnpm typecheck
pnpm build
```

También puedes usar `pnpm db` como atajo para validar Prisma y generar Prisma Client.

## Docker Opcional

Docker Compose starts PostgreSQL, Redis and NATS JetStream.
It remains available for future production-like development, CI environments or machines with
enough resources.

```bash
pnpm docker:up
docker compose -f docker-compose.yml up -d
```

## Current Scope

This foundation intentionally does not implement POS sales, cash sessions, orders,
inventory, billing or KDS workflows yet.
