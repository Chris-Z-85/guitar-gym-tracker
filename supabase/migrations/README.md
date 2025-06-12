# Database Migrations

This directory contains all database migrations for the Guitar Gym Tracker application.

## Directory Structure

```
migrations/
├── tables/           # Table creation and modifications
├── policies/         # Row Level Security (RLS) policies
├── functions/        # Database functions and procedures
└── seeds/           # Seed data for development
```

## Migration Naming Convention

Migrations follow this naming pattern:
`YYYYMMDDHHMMSS_descriptive_name.sql`

For example:
- `20240325000000_create_practice_items.sql`
- `20240325000100_add_practice_items_policies.sql`

## Running Migrations

### Local Development
```bash
supabase migration up
```

### Production
Migrations are automatically applied when pushing to the Supabase project:
```bash
supabase db push
```

## Creating New Migrations

1. Create a new migration file with the current timestamp:
```bash
supabase migration new descriptive_name
```

2. Add your SQL commands to the new file

3. Test locally:
```bash
supabase migration up
```

## Best Practices

1. Each migration should be atomic and focused on a single change
2. Always include both "up" and "down" migrations when possible
3. Test migrations locally before pushing to production
4. Document complex migrations with comments
5. Keep migrations immutable once they're in production 