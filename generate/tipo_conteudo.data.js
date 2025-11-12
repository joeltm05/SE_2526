
const { faker } = require("@faker-js/faker");

function generateTipoConteudo() {
  return {
    nome: faker.lorem.words(2),
    descricao: faker.lorem.sentence(),
  };
}

const numRecords = 5;
const tiposConteudo = Array.from({ length: numRecords }, generateTipoConteudo);

console.log(JSON.stringify(tiposConteudo, null, 2));


