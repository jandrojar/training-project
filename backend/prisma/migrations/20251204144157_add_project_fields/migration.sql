-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('PLANNED', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD');

-- CreateEnum
CREATE TYPE "ProjectPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "deadline" TIMESTAMP(3),
ADD COLUMN     "description" TEXT,
ADD COLUMN     "priority" "ProjectPriority" NOT NULL DEFAULT 'MEDIUM',
ADD COLUMN     "status" "ProjectStatus" NOT NULL DEFAULT 'PLANNED',
ADD COLUMN     "tags" TEXT[];
