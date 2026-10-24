-- Enable row-level security on the transaction table
ALTER TABLE "Transaction" ENABLE ROW LEVEL SECURITY;

-- Allow authenticated buyers/sellers to read their own transactions,
-- and admin users to read all transactions.
CREATE POLICY transaction_select_policy ON "Transaction"
  FOR SELECT
  USING (
    current_setting('app.current_user_role', true) = 'admin'
    OR current_setting('app.current_user_id', true) = "buyerId"
    OR current_setting('app.current_user_id', true) = "sellerId"
  );

-- Allow inserts only when the current session user is the buyer or an admin.
CREATE POLICY transaction_insert_policy ON "Transaction"
  FOR INSERT
  WITH CHECK (
    current_setting('app.current_user_role', true) = 'admin'
    OR current_setting('app.current_user_id', true) = "buyerId"
  );

-- Allow updates only for buyer or seller of the transaction, or admin.
CREATE POLICY transaction_update_policy ON "Transaction"
  FOR UPDATE
  USING (
    current_setting('app.current_user_role', true) = 'admin'
    OR current_setting('app.current_user_id', true) = "buyerId"
    OR current_setting('app.current_user_id', true) = "sellerId"
  )
  WITH CHECK (
    current_setting('app.current_user_role', true) = 'admin'
    OR current_setting('app.current_user_id', true) = "buyerId"
    OR current_setting('app.current_user_id', true) = "sellerId"
  );

-- Allow deletes only for admin users.
CREATE POLICY transaction_delete_policy ON "Transaction"
  FOR DELETE
  USING (
    current_setting('app.current_user_role', true) = 'admin'
  );

-- Prevent multiple active transactions for the same product.
CREATE UNIQUE INDEX IF NOT EXISTS unique_active_transaction_per_product
  ON "Transaction" ("productId")
  WHERE status IN ('pending', 'processing', 'paid');
