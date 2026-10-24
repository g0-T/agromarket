-- CreateIndex
CREATE INDEX "Product_createdAt_idx" ON "Product"("createdAt");

-- CreateIndex
CREATE INDEX "Product_category_createdAt_idx" ON "Product"("category", "createdAt");
