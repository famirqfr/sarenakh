/*
  Warnings:

  - You are about to drop the `FoundCash` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FoundClue` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `QuestionHelp` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "FoundCash";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "FoundClue";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "QuestionHelp";
PRAGMA foreign_keys=on;
