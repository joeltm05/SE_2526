
const { faker } = require("@faker-js/faker");

function generateArea() {
  return {
    nome: faker.lorem.words(3),
    descricao: faker.lorem.sentence(),
    data_criacao: faker.date.past().toISOString(),
    contexto: faker.lorem.paragraph(),
    categoria: faker.number.int({ min: 1, max: 10 }), // Assuming category IDs are between 1 and 10
  };
}

const numRecords = 5;
const areas = Array.from({ length: numRecords }, generateArea);

console.log(JSON.stringify(areas, null, 2));


