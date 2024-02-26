const path = require('path');
const fs = require('fs');
const xlsx = require('xlsx');
const axios = require('axios');
const nodemailer = require('nodemailer');

export default {
    Mutation: {
        exportarParaExcel: async (_, { dados }) => {
            if (!dados || dados.length === 0) {
                throw new Error('Dados vazios ou ausentes.');
            }

            try {
                // Lógica para criar e salvar o arquivo Excel no servidor
                const caminhoArquivo = await criarArquivoExcel(dados);

                // Retorna o caminho do arquivo ou uma mensagem de sucesso
                return `Arquivo salvo com sucesso em ${caminhoArquivo}`;
            } catch (error) {
                console.error('Erro ao exportar para o Excel:', error);
                throw new Error('Erro ao exportar para o Excel');
            }
        },

        enviarEmail: (_, { empresa, mensagem }) => sendEmail(empresa, mensagem),
    },
};

// Função para criar o arquivo Excel
async function criarArquivoExcel(dados) {
    const caminhoArquivo = path.resolve(__dirname, '../../../../../pagamentos.xlsx');
    const nomeFolhaCalculo = 'Pagamentos';

    let livroTrabalho;
    let folhaCalculo;

    if (fs.existsSync(caminhoArquivo)) {
        const conteudoAntigo = fs.readFileSync(caminhoArquivo);
        livroTrabalho = xlsx.read(conteudoAntigo, { type: 'buffer' });

        // Verifique se a folha de cálculo já existe
        if (livroTrabalho.SheetNames.includes(nomeFolhaCalculo)) {
            folhaCalculo = livroTrabalho.Sheets[nomeFolhaCalculo];
        } else {
            // Se não existir, crie uma nova folha de cálculo
            folhaCalculo = xlsx.utils.aoa_to_sheet([]);
            xlsx.utils.book_append_sheet(livroTrabalho, folhaCalculo, nomeFolhaCalculo);
        }
    } else {
        // Se o arquivo não existir, crie um novo livro de trabalho com uma nova folha de cálculo
        livroTrabalho = xlsx.utils.book_new();
        folhaCalculo = xlsx.utils.aoa_to_sheet([]);
        xlsx.utils.book_append_sheet(livroTrabalho, folhaCalculo, nomeFolhaCalculo);
    }

    // Adicione os novos dados à folha de cálculo existente
    dados.forEach((linha) => {
        xlsx.utils.sheet_add_aoa(folhaCalculo, [linha], { origin: -1 });
    });

    // Salve o arquivo
    xlsx.writeFile(livroTrabalho, caminhoArquivo);

}

const transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    secure: false,
    auth: {
        user: 'nelsinmodenez@outlook.com',
        pass: '1q2w3e4r5tNe1'
    }
});

// Função para enviar e-mail
const sendEmail = async (empresa, mensagem) => {
    try {
        const mailOptions = {
            from: 'nelsinmodenez@outlook.com',
            to: 'nelsonmodenezneto@hotmail.com',
            subject: `Mensagem da ${empresa}`,
            text: mensagem
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('E-mail enviado: ' + info.response);

        return { success: true, message: 'E-mail enviado com sucesso' };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Erro ao enviar o e-mail' };
    }
};




