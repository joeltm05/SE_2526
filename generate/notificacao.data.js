
const { faker } = require("@faker-js/faker");

function generateNotificacao() {
  return {
    utilizador: faker.number.int({ min: 1, max: 200 }), // Assuming utilizador IDs are between 1 and 200
    curso: faker.number.int({ min: 1, max: 50 }), // Assuming curso IDs are between 1 and 50
    tipo: faker.lorem.word({ length: { min: 5, max: 25 } }),
    mensagem: faker.lorem.sentence().substring(0, 50),
    data_envio: faker.date.past().toISOString(),
  };
}

const numRecords = 5;
const notificacoes = Array.from({ length: numRecords }, generateNotificacao);

console.log(JSON.stringify(notificacoes, null, 2));


