/*
  Warnings:

  - You are about to drop the `Billing` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Integration` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Invoice` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LoginHistory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SecuritySettings` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Billing" DROP CONSTRAINT "Billing_companyId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Integration" DROP CONSTRAINT "Integration_companyId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Invoice" DROP CONSTRAINT "Invoice_billingId_fkey";

-- DropForeignKey
ALTER TABLE "public"."LoginHistory" DROP CONSTRAINT "LoginHistory_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."SecuritySettings" DROP CONSTRAINT "SecuritySettings_companyId_fkey";

-- DropTable
DROP TABLE "public"."Billing";

-- DropTable
DROP TABLE "public"."Integration";

-- DropTable
DROP TABLE "public"."Invoice";

-- DropTable
DROP TABLE "public"."LoginHistory";

-- DropTable
DROP TABLE "public"."SecuritySettings";
