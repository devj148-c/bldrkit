import { PrismaClient } from "@/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import path from "path";

function createPrismaClient() {
  const dbUrl = process.env.DATABASE_URL || "file:./dev.db";
  let resolvedUrl = dbUrl;

  if (dbUrl.startsWith("file:")) {
    const filePath = dbUrl.replace("file:", "");
    if (filePath.startsWith("./") || filePath.startsWith("../")) {
      resolvedUrl = "file:" + path.resolve(process.cwd(), filePath.replace("./", ""));
    }
  }

  const adapter = new PrismaLibSql({ url: resolvedUrl });
  return new PrismaClient({ adapter });
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
