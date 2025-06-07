/*
  Warnings:

  - You are about to drop the `TeamActionLog` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "TeamActionLog";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "teamId" TEXT,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "phaseId" TEXT,
    "delta" INTEGER,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "logs_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "logs_phaseId_fkey" FOREIGN KEY ("phaseId") REFERENCES "GamePhase" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
