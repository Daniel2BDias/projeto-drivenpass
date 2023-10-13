import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient = new PrismaClient();

export function connectDb(): void {
    prisma = new PrismaClient();
  }
  
export async function disconnectDB(): Promise<void> {
    await prisma?.$disconnect();
    prisma = null;
  }

export default prisma;