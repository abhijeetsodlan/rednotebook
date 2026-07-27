import { Prisma } from "@prisma/client";

export function isUnavailableDatabase(error: unknown) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return ["P2021", "P2022", "P1001", "P1003"].includes(error.code);
  }
  return error instanceof Prisma.PrismaClientInitializationError || error instanceof Prisma.PrismaClientRustPanicError;
}
