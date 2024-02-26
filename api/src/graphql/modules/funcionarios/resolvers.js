const knex = require("../../../mysql.js");


export default {
	Query: {
		// Resolva as querys do arquivo schema.gql
		funcionarios: async () => {
			return knex("Funcionario").select("*");
		},
		funcionario: async (_, { idFuncionario }) => {
			const funcionario = await knex("funcionarios")
				.where("idFuncionario", idFuncionario)
				.first();
			return funcionario;
		},
		funcionariosByNome: async (_, { nome }) => {
			const funcionarios = await knex("Funcionario").where("nome", nome);
			return funcionarios;
		},
		funcionariosByStatus: async (_, { status }) => {
			const funcionarios = await knex("Funcionario").where("status", status);
			return funcionarios;
		},
		totalFuncionarios: async () => {
			const [count] = await knex("Funcionario").count("* as total");
			return count.total;
		},
		searchFuncionarios: async (_, { filter }) => {
			const funcionarios = await knex("Funcionario").where((builder) => {
				if (filter.nome) {
					builder.where("nome", "like", `%${filter.nome}%`);
				}
				if (filter.email) {
					builder.where("email", "like", `%${filter.email}%`);
				}
				if (filter.status) {
					builder.where("status", filter.status);
				}
				if (filter.tipo) {
					builder.where("tipo", filter.tipo);
				}
				if (filter.idFuncionario) {
					builder.where("idFuncionario", filter.idFuncionario);
				}
			});
			return funcionarios;
		},
		confereLogin: async (_, { email, senha }) => {
			const funcionario = await knex("Funcionario")
				.where("email", email)
				.where("senha", senha)
				.first();
			return funcionario;
		},
	},

	Mutation: {
		createFuncionario: async (_, { data }) => {
			await knex("Funcionario").insert(data);
			const novoFuncionario = await knex("Funcionario").where("Nome", data.Nome).andWhere("Cargo", data.Cargo).andWhere("Salario", data.Salario).andWhere("Email", data.Email).andWhere("Status", data.Status).first();
			return novoFuncionario;
		},

		updateFuncionario: async (_, { idFuncionario, Nome, Cargo, Status }) => {
			await knex("Funcionario")
				.where("idFuncionario", idFuncionario)
				.update({ Nome, Cargo, Status });
			const funcionario = await knex("Funcionario")
				.where("idFuncionario", idFuncionario)
				.first();
			return funcionario;
		},
			

		deleteFuncionario: async (_, { idFuncionario }) => {
			await knex("Funcionario").where("idFuncionario", idFuncionario).del();
			return true;
		},

		ativarFuncionario: async (_, { idFuncionario, status }) => {
			await knex("Funcionario")
				.where("idFuncionario", idFuncionario)
				.update({ status });
			const funcionario = await knex("Funcionario")
				.where("idFuncionario", idFuncionario)
				.first();
			return funcionario;
		},
	},
};
