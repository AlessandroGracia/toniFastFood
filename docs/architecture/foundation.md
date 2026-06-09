# ToniOS Foundation

This foundation establishes a TypeScript monorepo with clear app and package boundaries.

## Runtime Apps

- `admin-web`: SaaS dashboard shell.
- `pos-web`: touch POS shell prepared for offline-first behavior.
- `kds-web`: kitchen display shell.
- `api`: NestJS API with `/v1/health`.
- `workers`: placeholder runtime for async event consumers.

## Shared Packages

- `contracts`: cross-system DTOs and envelopes.
- `domain`: pure domain primitives.
- `db`: Prisma and database runtime boundary.
- `auth`: permissions and principal primitives.
- `tenant-context`: request and worker tenant scope.
- `sync-client`: offline sync contracts.
- `realtime-client`: realtime message contracts.

## Local Infrastructure

PostgreSQL, Redis and NATS JetStream are defined in the root Docker Compose file.
