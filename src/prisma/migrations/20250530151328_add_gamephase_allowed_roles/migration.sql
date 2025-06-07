-- CreateTable
CREATE TABLE "GamePhaseAllowedRole" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "role" TEXT NOT NULL,
    "gamePhaseId" TEXT NOT NULL,
    CONSTRAINT "GamePhaseAllowedRole_gamePhaseId_fkey" FOREIGN KEY ("gamePhaseId") REFERENCES "GamePhase" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
