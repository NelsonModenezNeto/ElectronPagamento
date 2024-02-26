const { app, BrowserWindow } = require('electron');
const cron = require('node-cron');
const accountSid = 'ACcfb1f57f1b55a2ef1b7a9a32950a2ee7';
const authToken = '1f9bb67bf7cee915ced49f93c24e3152';
const client = require('twilio')(accountSid, authToken);
const axios = require('axios');

let mainWindow;

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        width: 0,
        height: 0,
        webPreferences: {
            nodeIntegration: false,
            devTools: true
        }
    });
    mainWindow.fullScreen = true;
    mainWindow.loadFile(`pages/login.html`);
    mainWindow.setMenu(null);
    mainWindow.isResizable(false);
    mainWindow.webContents.openDevTools();

    cron.schedule('49 15 * * *', async () => {
        await sendFaturamentoReport();
        await mostrarProdutos();
    });
});


async function mostrarProdutos() {
    var dataAtual = new Date();
    var dia = dataAtual.getDate();
    var mes = dataAtual.getMonth() + 1;
    var ano = dataAtual.getFullYear();
    dia = dia < 10 ? '0' + dia : dia;
    mes = mes < 10 ? '0' + mes : mes;
    var dataFormatada = dia + '/' + mes + '/' + ano;

    const query = `query PagamentosData($data: String!) {
        pagamentosData(Data: $data) {
          valorTotal
          Metodo
        }
      }`;

    const variables = {
        data: dataFormatada
    };

    axios.post('http://localhost:4000', { query, variables })
        .then((response) => {
            client.messages
            .create({
                body: 'Segue suas vendas referentes ao dia ' + dataFormatada + '\n\n' + response.data.data.pagamentosData.map((pagamento) => pagamento.Metodo + ' - ' + pagamento.valorTotal + ' R$').join('\n'),
                from: 'whatsapp:+14155238886',
                to: 'whatsapp:+5519971641777'
            })
            .then(message => console.log(message.sid))
            .catch(error => console.log(error));
        }).catch((error) => {
            console.log(error);
        });
}

async function sendFaturamentoReport() {
    var dataAtual = new Date();
    var dia = dataAtual.getDate();
    var mes = dataAtual.getMonth() + 1;
    var ano = dataAtual.getFullYear();
    dia = dia < 10 ? '0' + dia : dia;
    mes = mes < 10 ? '0' + mes : mes;
    var dataFormatada = dia + '/' + mes + '/' + ano;

    try {
        const totalValue = await faturamentoTotal();
        client.messages
            .create({
                body: 'Olá! Segue o valor do faturamento total referente ao dia ' + dataFormatada + ' Faturamento: ' + totalValue.toFixed(2) + ' R$',
                from: 'whatsapp:+14155238886',
                to: 'whatsapp:+5519971641777'
            })
            .then(message => console.log(message.sid))
            .catch(error => console.log(error));
        console.log("Relatório enviado às 08:17 todos os dias.");
    } catch (error) {
        console.log(error);
    }
}

async function faturamentoTotal() {
    var dataAtual = new Date();
    var dia = dataAtual.getDate();
    var mes = dataAtual.getMonth() + 1;
    var ano = dataAtual.getFullYear();
    dia = dia < 10 ? '0' + dia : dia;
    mes = mes < 10 ? '0' + mes : mes;
    var dataFormatada = dia + '/' + mes + '/' + ano;

    const query = `query Query($data: String!) {
        pagamentosData(Data: $data) {
          valorTotal
        }
      }`;
    const variables = {
        data: dataFormatada
    };

    const response = await axios.post('http://localhost:4000', { query, variables });
    const pagamentosData = response.data.data.pagamentosData;

    if (pagamentosData && pagamentosData.length > 0) {
        let totalValue = 0;

        // Iterate through pagamentosData and sum up the valorTotal
        pagamentosData.forEach(item => {
            const valorTotal = item.valorTotal;

            if (typeof valorTotal !== 'undefined') {
                console.log('Valor Total for item:', valorTotal);
                totalValue += parseFloat(valorTotal);
            } else {
                console.log('Valor Total for item is undefined.');
            }
        });

        console.log('Total Value:', totalValue); // Log the final totalValue
        return totalValue;
    } else {
        console.log('pagamentosData is empty.');
        return 0;
    }
}
