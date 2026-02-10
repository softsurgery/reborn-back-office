# Project Conventions

## Purpose

This document defines the engineering conventions for **reborn-back-office**, a **Next.js** web application used to manage and operate the **reborn-mobile-app-v2** mobile application.

These conventions exist to:

- Keep the codebase **consistent, predictable, and readable**
- Make code reviews faster and more objective
- Reduce onboarding time for new developers
- Minimize regressions, security issues, and technical debt
- Establish a scalable foundation as the team grows

> This document is intended to evolve. All changes must be proposed via PR (see section: _How to propose a change_).

---

## Quick Reference

- **Framework**: Next.js (Page Router)
- **Language**: TypeScript
- **Package manager**: yarn
- **Styling**: Tailwind
- **Linting**: ESLint + Prettier
- **Testing**: **Not implemented**
- **Deployment**: CI-driven

---

## 1. Repository Layout

```
reborn-back-office/
├── docs/               # Project documentation
├── public/             # Static assets
├── src/
│   ├── api/            # API clients, external integrations
│   ├── components/     # Reusable UI components
│   ├── context/        # Global state management
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Shared utilities, helpers, clients
│   ├── pages/          # Next.js Page Router (routes, layouts, pages)
│   ├── styles/         # Global styles, theme, variables
│   └── types/          # Shared TypeScript types
├── .dockerignore
├── .env.example        # Environment variable template
├── .eslintrc.json
├── .gitignore
├── components.json
├── Dockerfile
├── next-auth.d.ts
├── next-env.d.ts
├── next-i18next.config.js
├── next.config.js
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.local.json
└── yarn.lock
```

### Rules

- **Feature-first** structure is preferred for business logic
- Components must be **small, reusable, and colocated** with their feature when possible
- api/api.ts, lib/lib.ts & pages/page.tsx names use **kebab-case**
- components/component.tsx, hooks/hook.ts & context/context.ts names use **PascalCase**
- hooks must start with `use` followed by the name of the hook in **PascalCase**
- No `any`, `unknown` & `object` unless justified
- Keep components under ~500 lines

---

## 2. Git Workflow & Branching

### Main Branches

- `main`: Production-ready, always deployable
- `dev` : Integration branch if release cadence requires it

### Rules

- Always branch from `dev`
- Prefer **merge** over rebase to keep history clean

---

## 3. Commit Messages

We follow **Conventional Commits**.

### Format

```
type(scope): subject
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `chore`: Maintenance tasks
- `perf`: Performance improvement
- `build`: Changes that affect the build system or external dependencies
- `ref`: Code refactor without behavior change
- `test`: Adding or updating tests
- `ci`: CI/CD related changes

- Use **Draft PRs** for early feedback
- Keep PRs small and focused
- Add labels (feature, fix, docs, breaking)

---
