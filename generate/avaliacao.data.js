
const { faker } = require("@faker-js/faker");

function generateAvaliacao() {
  return {
    formador: faker.number.int({ min: 1, max: 20 }), // Assuming formador IDs are between 1 and 20
    formando: faker.number.int({ min: 1, max: 50 }), // Assuming formando IDs are between 1 and 50
    nota: faker.number.int({ min: 0, max: 5 }),
    observacao: faker.lorem.sentence(),
    data_avaliacao: faker.date.past().toISOString(),
    n_horas_presenca: faker.number.int({ min: 1, max: 100 }),
  };
}

const numRecords = 5;
const avaliacoes = Array.from({ length: numRecords }, generateAvaliacao);

console.log(JSON.stringify(avaliacoes, null, 2));


