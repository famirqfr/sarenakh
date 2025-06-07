/*
  Warnings:

  - You are about to drop the column `expiresAt` on the `GamePhase` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_GamePhase" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "rewardPoints" INTEGER NOT NULL,
    "duration" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_GamePhase" ("createdAt", "description", "duration", "id", "isActive", "rewardPoints", "title") SELECT "createdAt", "description", "duration", "id", "isActive", "rewardPoints", "title" FROM "GamePhase";
DROP TABLE "GamePhase";
ALTER TABLE "new_GamePhase" RENAME TO "GamePhase";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
