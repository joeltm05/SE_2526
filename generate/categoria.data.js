
const { faker } = require("@faker-js/faker");

function generateCategoria() {
  return {
    nome: faker.lorem.words(2),
    descricao: faker.lorem.sentence(),
    data_criacao: faker.date.past().toISOString(),
    contexto: faker.lorem.paragraph(),
  };
}

const numRecords = 5;
const categorias = Array.from({ length: numRecords }, generateCategoria);

console.log(JSON.stringify(categorias, null, 2));


