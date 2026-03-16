---
description: Update the Prisma database schema safely.
---
# Deploy Database Schema

When asked to modify the Next.js database schema for Autocut, use these safe development practices.

1. Edit the core `prisma/schema.prisma` file appropriately.
2. Run `npx prisma format` via absolute terminal command to fix formatting and validate syntax errors.
3. Run `npx prisma migrate dev --name <descriptive_migration_name>` to safely generate SQL migration files and apply them to the local SQLite/Postgres dev database. **Do not use `npx prisma db push`** unless the user explicitly requested it or specifically mentioned ignoring schema history.
4. Run `npx prisma generate` to rebuild the TypeScript Prisma Client so the frontend editor recognizes the new types.
5. Search the frontend `app/api/` or `app/lib/` for components that use the modified model, and refactor the `select` or `include` statements to handle the new schema properly.
