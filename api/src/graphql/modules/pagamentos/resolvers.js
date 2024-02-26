const knex = require("../../../mysql");

export default {
	Query: {
		pagamentos: async () => {
			return knex("Pagamento").select("*");
		},

		pagamento: async (_, { idBancada }) => {
			const bancada = await knex("Pagamento")
				.where("idBancada", idBancada)
				.first();
			return bancada;
		},

		pagamentosData: async (_, { Data }) => {
			const bancadas = await knex("Pagamento")
				.where("Data", Data)
				.select("*"); 
			return bancadas;
		},

	},

	Mutation: {
		createPagamento: async (_, { data }) => {
			const [id] = await knex("Pagamento").insert(data);
			const novaPagamento = await knex("Pagamento").where("idPagamento", id).first();
			return novaPagamento;
		},
		updatePagamento: async (_, { idBancada, data }) => {
			const bancadaAtualizada = await knex("Pagamento")
				.where("idBancada", idBancada)
				.update(data);
			const bancada = await knex("Pagamento")
				.where("idBancada", idBancada)
				.first();
			return bancada;
		},
		deleteBancada: async (_, { idBancada }) => {
			await knex("Pagamento").where("idBancada", idBancada).del();
			return true;
		},
		ativarBancada: async (_, { idBancada, status }) => {
			await knex("Pagamento").where("idBancada", idBancada).update({ status });
			const bancada = await knex("Pagamento")
				.where("idBancada", idBancada)
				.first();
			return bancada;
		},
	},
};
