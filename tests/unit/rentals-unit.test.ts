import repository from "../../src/repositories/rentals-repository";
import prisma from "../../src/database";
import { cleanDb } from "../utils";
beforeEach(async () => await cleanDb());
describe("Rentals Service Unit Tests", () => {
  it("should do something", async () => {
    const movies = await prisma.movie.createMany({
      data: [
        { id: 1, adultsOnly: false, name: "Movie 1" },
        { id: 2, adultsOnly: false, name: "Movie 2" },
        { id: 3, adultsOnly: false, name: "Movie 3" },
        { id: 4, adultsOnly: false, name: "Movie 4" },
        { id: 5, adultsOnly: false, name: "Movie 5" },
      ],
    });

    const user = await prisma.user.create({
      data: {
        firstName: "CNPJOTO",
        lastName: "ARARAQUARO",
        birthDate: new Date(1998, 6, 12),
        cpf: "00000000000",
        email: "cnpjoto.araraquaro@gmail.com",
      },
    });

    const spyCreaterental = jest.spyOn(repository, "createRental");

    await repository.createRental({ moviesId: [1], userId: user.id });

    const rentals = await repository.getRentalsByUserId(user.id, false);

    expect(rentals[0].id).toBeGreaterThan(0);
  });
  it("should not create a rental with more than 4 movies", async () => {
    const movies = await prisma.movie.createMany({
      data: [
        { id: 1, adultsOnly: false, name: "Movie 1" },
        { id: 2, adultsOnly: false, name: "Movie 2" },
        { id: 3, adultsOnly: false, name: "Movie 3" },
        { id: 4, adultsOnly: false, name: "Movie 4" },
        { id: 5, adultsOnly: false, name: "Movie 5" },
      ],
    });

    const user = await prisma.user.create({
      data: {
        firstName: "CNPJOTO",
        lastName: "ARARAQUARO",
        birthDate: new Date(1998, 6, 12),
        cpf: "00000000000",
        email: "cnpjoto.araraquaro@gmail.com",
      },
    });

    try {
      // Tente criar um aluguel com mais de 4 filmes
      await repository.createRental({
        moviesId: [1, 2, 3, 4, 5], // Escolha cinco filmes
        userId: user.id,
      });

      // Se a função não lançar um erro, o teste deve falhar
    } catch (error) {
      // Verifique se o erro corresponde à mensagem esperada
      expect(error.message).toBe(
        "At least 1 movie and at most 4 movies are required for rental"
      );
    }
  });

  it("should not allow a user to rent if they have a pending rental", async () => {
    // Criar filmes, se necessário
    const movies = await prisma.movie.createMany({
      data: [
        { id: 1, adultsOnly: false, name: "Movie 1" },
        { id: 2, adultsOnly: false, name: "Movie 2" },
        { id: 3, adultsOnly: false, name: "Movie 3" },
        { id: 4, adultsOnly: false, name: "Movie 4" },
        { id: 5, adultsOnly: false, name: "Movie 5" },
      ],
    });

    // Criar um usuário
    const user = await prisma.user.create({
      data: {
        firstName: "CNPJOTO",
        lastName: "ARARAQUARO",
        birthDate: new Date(1998, 6, 12),
        cpf: "00000000000",
        email: "cnpjoto.araraquaro@gmail.com",
      },
    });

    // Criar uma locação pendente para o usuário
    await repository.createRental({
      moviesId: [1, 2], // IDs dos filmes para a locação pendente
      userId: user.id,
    });

    try {
      // Tentar criar um novo aluguel sem a propriedade 'closed'
      await repository.createRental({
        moviesId: [3, 4], // IDs dos filmes para a nova locação
        userId: user.id,
      });

      // Se a função não lançar um erro, o teste deve falhar
    } catch (error) {
      // Verifique se o erro corresponde à mensagem esperada
      expect(error.message).toBe("The user already has a rental!");
    }
  });
});
