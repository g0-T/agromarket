-- This script marks older active transactions as 'expired' leaving the most recent per product.
-- Run only after taking a backup.

BEGIN;

WITH ranked AS (
  SELECT id, "productId", "createdAt", ROW_NUMBER() OVER (PARTITION BY "productId" ORDER BY "createdAt" DESC, id DESC) AS rn
  FROM "Transaction"
  WHERE status IN ('pending','processing','paid')
)
UPDATE "Transaction" t
SET status = 'expired'
FROM ranked r
WHERE t.id = r.id AND r.rn > 1;

COMMIT;

-- Verify no duplicates remain:
-- SELECT product_id, count(*) FROM "transaction" WHERE status IN ('pending','processing','paid') GROUP BY product_id HAVING count(*) > 1;
