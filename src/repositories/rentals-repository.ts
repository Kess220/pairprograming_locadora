import prisma from "../database";
import { RentalInput } from "../protocols";
import { RENTAL_LIMITATIONS } from "../services/rentals-service";

function getRentals() {
  return prisma.rental.findMany();
}

function getRentalById(id: number, includeMovies = false) {
  return prisma.rental.findUnique({
    where: { id },
    include: {
      movies: includeMovies
    }
  })
}

function getRentalsByUserId(userId: number, closed = true) {
  return prisma.rental.findMany({
    where: {
      userId,
      closed
    }
  })
}

// FIXME: Esta é uma operação onde faria sentido o uso de TRANSACTIONS.
// Caso esteja curioso(a), procure saber o que é e tente implementar aqui!
async function createRental(rentalInput: RentalInput) {
  const rental = await prisma.rental.create({
    data: {
      userId: rentalInput.userId,
      endDate: new Date(new Date().getDate() + RENTAL_LIMITATIONS.RENTAL_DAYS_LIMIT),
    }
  });

  const { moviesId } = rentalInput;
  return await connectMoviesToRental(moviesId, rental.id);
}

// FIXME: Esta é uma operação onde faria sentido o uso de TRANSACTIONS.
// Caso esteja curioso(a), procure saber o que é e tente implementar aqui!
async function finishRental(id: number) {
  await disconnectMoviesFromRental(id);
  await prisma.rental.update({
    where: { id },
    data: {
      closed: true
    }
  });
}

async function connectMoviesToRental(moviesId: number[], rentalId: number) {
  for (let i = 0; i < moviesId.length; i++) {
    const id = moviesId[i];
    await prisma.movie.update({
      data: { rentalId },
      where: { id }
    })
  }
}

async function disconnectMoviesFromRental(rentalId: number) {
  const rental = await getRentalById(rentalId, true);
  const movies = rental.movies;
  for (let i = 0; i < movies.length; i++) {
    const id = movies[i].id;
    await prisma.movie.update({
      where: { id },
      data: { rentalId: null },
    })
  }
}

export default {
  getRentals,
  getRentalById,
  getRentalsByUserId,
  createRental,
  finishRental
};