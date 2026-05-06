# Lakeland Wildlife Oasis - Web Platform

Complete rebuild of the Lakeland Wildlife Oasis web platform with modern tech stack and CMS-driven content management.

## Tech Stack

- **Frontend:** Next.js 16 + React + TypeScript
- **Database:** PostgreSQL + Prisma
- **CMS:** Strapi (self-hosted)
- **Monorepo:** Turborepo + pnpm
- **Hosting:** Hybrid (Vercel + DigitalOcean)

## Project Structure

```
lwo/
├── apps/
│   ├── public-site/      # Public-facing website (Next.js)
│   ├── admin-site/       # Staff admin portal (Next.js)
│   └── cms/              # Strapi CMS
├── packages/
│   ├── shared-types/     # Shared TypeScript types
│   ├── ui/               # Shared React components
│   └── database/         # Prisma schema and client
└── .notes/               # Project documentation
```

## Getting Started

### Prerequisites

- **Node.js** 20.x or later
- **pnpm** 8.x or later
- **PostgreSQL** (or Supabase account)

### Installation

```bash
# Install pnpm globally (if not already installed)
npm install -g pnpm

# Install all dependencies
pnpm install
```

### Running Development Servers

**Run all apps simultaneously:**

```bash
pnpm dev
```

This will start:

- Public site: http://localhost:3000
- Admin site: http://localhost:3001
- CMS: http://localhost:1337

**Run individual apps:**

```bash
# Public site only
pnpm dev --filter=public-site

# Admin site only
pnpm dev --filter=admin-site

# CMS only
pnpm dev --filter=cms
```

### Common pnpm Commands

Unlike yarn, pnpm uses slightly different syntax. Here's a quick reference:

| Task                             | pnpm Command                              | Yarn Equivalent                            |
| -------------------------------- | ----------------------------------------- | ------------------------------------------ |
| Install dependencies             | `pnpm install`                            | `yarn install`                             |
| Add package to workspace root    | `pnpm add -w <package>`                   | `yarn add -W <package>`                    |
| Add package to specific app      | `pnpm add <package> --filter=public-site` | `yarn workspace public-site add <package>` |
| Run script in all workspaces     | `pnpm -r <script>`                        | `yarn workspaces run <script>`             |
| Run script in specific workspace | `pnpm --filter=public-site <script>`      | `yarn workspace public-site <script>`      |

### Available Scripts

```bash
# Development
pnpm dev              # Start all apps in development mode
pnpm dev --filter=<app-name>  # Start specific app

# Building
pnpm build            # Build all apps
pnpm build --filter=<app-name>  # Build specific app

# Code Quality
pnpm lint             # Lint all code
pnpm type-check       # TypeScript type checking
pnpm format           # Format code with Prettier

# Testing (when tests are added)
pnpm test             # Run all tests

# Database (from packages/database)
pnpm --filter=database db:generate   # Generate Prisma Client
pnpm --filter=database db:migrate    # Run migrations
pnpm --filter=database db:studio     # Open Prisma Studio
```

## Environment Setup

Each app requires environment variables. Copy the example files:

```bash
# Public site
cp apps/public-site/.env.example apps/public-site/.env.local

# Admin site
cp apps/admin-site/.env.example apps/admin-site/.env.local

# CMS
cp apps/cms/.env.example apps/cms/.env

# Database package
cp packages/database/.env.example packages/database/.env
```

See `.notes/setup/environment-variables.md` for detailed configuration guide.

## Documentation

All project documentation is in the `.notes/` directory:

- **[Agent Context Guide](.notes/agent-context.md)** - Current project state and quick reference
- **[Architecture Decisions](.notes/decisions/)** - ADRs for key technical choices
- **[Setup Guides](.notes/setup/)** - Local development, deployment, environment variables
- **[Data Models](.notes/architecture/data-models.md)** - Database schema and relationships
- **[Project Plan](.opencode/plans/lwo-platform-rebuild.md)** - Complete project roadmap

## Current Status

**Phase 2: Monorepo Scaffold** - In Progress

✅ Completed:

- Turborepo + pnpm workspace setup
- Next.js public and admin sites
- Shared packages (types, UI, database)
- Prisma schema defined
- Strapi CMS setup
- TypeScript path aliases
- ESLint configuration

🔜 Next:

- Phase 3: Database & Infrastructure setup

See the [master project plan](.opencode/plans/lwo-platform-rebuild.md) for full details.

## Development Workflow

1. Create a feature branch
2. Make your changes
3. Test locally with `pnpm dev`
4. Lint and type-check: `pnpm lint && pnpm type-check`
5. Commit with clear message
6. Create PR (when ready for deployment)

## Troubleshooting

### Port already in use

```bash
# Kill process on port 3000
npx kill-port 3000

# Kill process on port 3001
npx kill-port 3001
```

### Stale dependencies

```bash
# Clear node_modules and reinstall
pnpm clean
pnpm install
```

### Prisma issues

```bash
# Regenerate Prisma Client
pnpm --filter=database db:generate
```

### Turbo cache issues

```bash
# Clear Turbo cache
rm -rf .turbo
```

## License

Private - Lakeland Wildlife Oasis

## Contact

Project maintainer: Robin
