
const { faker } = require("@faker-js/faker");

function generateSincrono() {
  return {
    id: faker.number.int({ min: 1, max: 100 }),
    curso: faker.number.int({ min: 1, max: 50 }), // Assuming curso IDs are between 1 and 50
    formador: faker.number.int({ min: 1, max: 20 }), // Assuming formador IDs are between 1 and 20
    vagas: faker.number.int({ min: 0, max: 50 }),
    link_recurso: faker.internet.url(),
    data_limite_inscricao: faker.date.future().toISOString(),
    presencas_aula: faker.number.int({ min: 0, max: 100 }),
  };
}

const numRecords = 5;
const sincronos = Array.from({ length: numRecords }, generateSincrono);

console.log(JSON.stringify(sincronos, null, 2));


