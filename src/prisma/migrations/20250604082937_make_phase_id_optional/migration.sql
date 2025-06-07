-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TeamActionLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "teamId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "phaseId" TEXT,
    "delta" INTEGER,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TeamActionLog_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TeamActionLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TeamActionLog_phaseId_fkey" FOREIGN KEY ("phaseId") REFERENCES "GamePhase" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_TeamActionLog" ("action", "delta", "id", "phaseId", "teamId", "timestamp", "userId") SELECT "action", "delta", "id", "phaseId", "teamId", "timestamp", "userId" FROM "TeamActionLog";
DROP TABLE "TeamActionLog";
ALTER TABLE "new_TeamActionLog" RENAME TO "TeamActionLog";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
