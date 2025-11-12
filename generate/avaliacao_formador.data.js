
const { faker } = require("@faker-js/faker");

function generateAvaliacaoFormador() {
  return {
    formador: faker.number.int({ min: 1, max: 20 }), // Assuming formador IDs are between 1 and 20
    formando: faker.number.int({ min: 1, max: 50 }), // Assuming formando IDs are between 1 and 50
    data_avaliacao: faker.date.past().toISOString(),
    observacao: faker.lorem.sentence().substring(0, 60),
    avaliacao_formador: faker.number.float({ min: 0, max: 5, precision: 0.1 }),
  };
}

const numRecords = 5;
const avaliacoesFormador = Array.from({ length: numRecords }, generateAvaliacaoFormador);

console.log(JSON.stringify(avaliacoesFormador, null, 2));


