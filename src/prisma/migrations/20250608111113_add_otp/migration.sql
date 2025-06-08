-- CreateTable
CREATE TABLE "OTP" (
    "phone" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL
);
