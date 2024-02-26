const knex = require("../../../mysql");
export default {
	Query: {
		vendidos: async () => {
			return knex("Vendidos").select("*");
		},
		vendido: async (_, { idVendido }) => {
			const conserto = await knex("Vendidos")
				.where("idVendido", idVendido)
				.first();
			return conserto;
		},
	},

	Mutation: {
		createVendido: async (_, { data }) => {
			const [id] = await knex("Vendidos").insert(data);
			const novoConserto = await knex("Vendidos")
				.where("idVendido", id)
				.first();
			return novoConserto;
		},
		updateVendido: async (_, { idConserto, data }) => {
			const consertoAtualizado = await knex("Vendidos")
				.where("idConserto", idConserto)
				.update(data);
			const conserto = await knex("Vendidos")
				.where("idConserto", idConserto)
				.first();
			return conserto;
		},
	},
};
