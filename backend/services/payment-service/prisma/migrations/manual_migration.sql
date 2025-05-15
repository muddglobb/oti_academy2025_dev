-- Migration script to remove back payment related fields
-- This should be run after applying the new Prisma schema

-- Drop columns from payment table
ALTER TABLE "Payment" DROP COLUMN IF EXISTS "backPaymentMethod";
ALTER TABLE "Payment" DROP COLUMN IF EXISTS "backAccountNumber";
ALTER TABLE "Payment" DROP COLUMN IF EXISTS "backRecipient";
ALTER TABLE "Payment" DROP COLUMN IF EXISTS "backStatus";
ALTER TABLE "Payment" DROP COLUMN IF EXISTS "backCompletedAt";

-- Note: You may need to handle any references to these fields in your application code
-- Ensure to take a database backup before applying this migration
