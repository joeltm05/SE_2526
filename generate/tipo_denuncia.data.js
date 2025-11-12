
const { faker } = require("@faker-js/faker");

function generateTipoDenuncia() {
  return {
    tipo: faker.lorem.word(),
  };
}

const numRecords = 5;
const tiposDenuncia = Array.from({ length: numRecords }, generateTipoDenuncia);

console.log(JSON.stringify(tiposDenuncia, null, 2));


