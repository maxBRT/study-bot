-- DropForeignKey
ALTER TABLE "token_usage" DROP CONSTRAINT "token_usage_messageId_fkey";

-- AddForeignKey
ALTER TABLE "token_usage" ADD CONSTRAINT "token_usage_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "message"("id") ON DELETE CASCADE ON UPDATE CASCADE;
