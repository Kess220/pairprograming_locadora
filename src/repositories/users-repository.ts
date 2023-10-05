import prisma from "../database";

async function getById(id: number) {
	return await prisma.user.findUnique({
		where: { id },
	});
}

export async function createUser(
	firstName: string,
	lastName: string,
	email: string,
	cpf: string,
	birthDate: Date
) {
	const user = await prisma.user.create({
		data: {
			firstName: firstName,
			lastName: lastName,
			email: email,
			cpf: cpf,
			birthDate,
		},
	});

	return user;
}

export default {
	getById,
	createUser
};
