This migration enables Row-Level Security (RLS) on the `transaction` table and adds a partial unique index that prevents multiple active transactions per product.

IMPORTANT: before applying this migration to a live database you MUST:

1) Back up the database (pg_dump or similar).

   Example:

   ```bash
   pg_dump --format=custom --file=backup.dump --dbname="$DATABASE_CONNECTION_STRING"
   ```

2) Check for duplicate active transactions which would violate the partial unique index:

   ```bash
   psql "$DATABASE_CONNECTION_STRING" -c "SELECT product_id, count(*) FROM \"transaction\" WHERE status IN ('pending','processing','paid') GROUP BY product_id HAVING count(*) > 1;"
   ```

3) If duplicates exist, resolve them manually or run the provided cleanup SQL which marks older active transactions as `expired`:

   ```bash
   psql "$DATABASE_CONNECTION_STRING" -f prisma/migrations/20260605120000_add_transaction_rls/cleanup_duplicates.sql
   ```

4) Apply the migration SQL:

   ```bash
   psql "$DATABASE_CONNECTION_STRING" -f prisma/migrations/20260605120000_add_transaction_rls/migration.sql
   ```

5) Verify policies and index:

   ```bash
   psql "$DATABASE_CONNECTION_STRING" -c "\d POLICY transaction_select_policy"
   psql "$DATABASE_CONNECTION_STRING" -c "SELECT indexname, indexdef FROM pg_indexes WHERE tablename='transaction' AND indexname='unique_active_transaction_per_product';"
   ```

Automation script:

A helper script is available at `apps/backend/scripts/apply_rls.sh`. By default it will create a backup and refuse to run if duplicates are found. Run with `--clean` to automatically expire duplicates (use with caution).
