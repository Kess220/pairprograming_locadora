import prisma from "../../src/database";

export async function cleanDb() {
  await prisma.movie.deleteMany();
  await prisma.rental.deleteMany();
  await prisma.user.deleteMany();
}