const knex = require("knex")({
	client: "mysql2",
	connection: {
	  host: "aws.connect.psdb.cloud",
	  user: "m8vd63ge1ca7iernbqkg",
	  password: "pscale_pw_QgvGkw0mnp6XCYofQ10qDkbNtXdXZ9gaD6cLAwcIHAh",
	  database: "teste",
	  ssl: {
		rejectUnauthorized: false,
	  },
	},
  });
  
  // Verificando a conexão
  knex.raw('SELECT 1+1 as result')
	.then(() => {
	  console.log("Conexão bem-sucedida com o banco de dados");
	})
	.catch((error) => {
	  console.error("Erro ao conectar ao banco de dados:", error);
	});
  
  module.exports = knex;
  