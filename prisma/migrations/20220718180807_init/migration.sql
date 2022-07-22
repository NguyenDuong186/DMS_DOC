-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "user_hoan_thanh_id" INTEGER,
ADD COLUMN     "user_xu_ly_id" INTEGER;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_user_xu_ly_id_fkey" FOREIGN KEY ("user_xu_ly_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_user_hoan_thanh_id_fkey" FOREIGN KEY ("user_hoan_thanh_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
