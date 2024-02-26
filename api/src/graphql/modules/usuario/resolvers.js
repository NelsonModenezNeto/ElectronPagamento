const knex = require("../../../mysql.js");

export default {
    Query: {
        confereLogin: async (_, { Nome, Senha }) => {
            const Usuario = await knex("Usuario").where("Nome", Nome).andWhere("Senha", Senha).first();
            return Usuario;
        },
        usuarios: async () => {
            return await knex("Usuario").select("*");
        },
        usuario: async (_, { idUsuario }) => {
            const Usuario = await knex("Usuario")
                .where("idUsuario", idUsuario)
                .first();
            return Usuario;
        },
        usuarioByNome: async (_, { Nome }) => {
            const Usuario = await knex("Usuario").where("Nome", Nome);
            return Usuario;
        },
        

    },
    Mutation: {
        createUsuario: async (_, { data }) => {
            await knex("Usuario").insert(data);
            const Usuario = await knex("Usuario").where("Nome", data.Nome).andWhere("Senha", data.Senha).first();
            return Usuario;
        }
    }
}