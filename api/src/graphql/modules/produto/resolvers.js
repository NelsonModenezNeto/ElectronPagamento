const knex = require("../../../mysql");

export default {
	Query: {
		produtos: async () => {
			return await knex("Produto").select("*");
		},
		produto: async (_, { idProduto }) => {
			const patrimonio = await knex("Produto")
				.where("idProduto", idProduto)
				.first();
			return patrimonio;
		},
		produtosByPreco: async (_, { Preco }) => {
			const Produto = await knex("Produto").where("Preco", Preco);
			return Produto;
		},
		produtosByNome: async (_, { nomeProduto }) => {
			const Produto = await knex("Produto").where("nomeProduto", nomeProduto);
			return Produto;
		},
	},

	Mutation: {
		createProduto: async (_, { data }) => {
			const [id] = await knex("Produto").insert(data);
			const novoProduto = await knex("Produto")
				.where("idProduto", id)
				.first();
			return novoProduto;
		},

		updateProduto: async (_, { idProduto, nomeProduto, Preco, Status}) => {
			await knex("Produto")
				.where("idProduto", idProduto)
				.update({ nomeProduto, Preco, Status});
			const Produto = await knex("Produto")
				.where("idProduto", idProduto)
				.first();
			return Produto;
		},
		
		deleteProduto: async (_, { idPatrimonio }) => {
			await knex("patrimonios").where("idPatrimonio", idPatrimonio).del();
			return true;
		},

	},
};
