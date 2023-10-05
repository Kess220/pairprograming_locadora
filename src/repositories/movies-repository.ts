import prisma from "../database"

async function getById(id: number) {
  return prisma.movie.findUnique({
    where: { id }
  })
}

export default {
  getById
}