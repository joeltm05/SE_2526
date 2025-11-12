
const { faker } = require("@faker-js/faker");

function generateTrabalhoSubmetido() {
  return {
    curso: faker.number.int({ min: 1, max: 50 }), // Assuming curso IDs are between 1 and 50
    avaliacao: faker.number.int({ min: 1, max: 100 }), // Assuming avaliacao IDs are between 1 and 100
    formando: faker.number.int({ min: 1, max: 50 }), // Assuming formando IDs are between 1 and 50
    observacao: faker.lorem.sentence().substring(0, 60),
    nota: faker.number.int({ min: 0, max: 20 }),
  };
}

const numRecords = 5;
const trabalhosSubmetidos = Array.from({ length: numRecords }, generateTrabalhoSubmetido);

console.log(JSON.stringify(trabalhosSubmetidos, null, 2));


