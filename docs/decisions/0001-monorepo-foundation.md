# 0001 Monorepo Foundation

## Decision

Use `pnpm` workspaces with Turborepo for the initial ToniOS monorepo.

## Rationale

The product needs multiple web apps, a NestJS API, worker processes and shared TypeScript packages.
Turborepo keeps the build graph simple while allowing cached builds, linting and typechecks across
apps and packages.

## Consequences

Package boundaries must stay explicit. Runtime apps consume shared packages through workspace
dependencies, while domain and contracts remain framework-agnostic.
