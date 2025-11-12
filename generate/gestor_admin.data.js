
const { faker } = require("@faker-js/faker");

function generateGestorAdmin() {
  return {
    n_cursos_criados: faker.number.int({ min: 0, max: 100 }),
    score: faker.number.int({ min: 0, max: 100 }),
    utilizador: faker.number.int({ min: 1, max: 200 }), // Assuming utilizador IDs are between 1 and 200
  };
}

const numRecords = 5;
const gestoresAdmin = Array.from({ length: numRecords }, generateGestorAdmin);

console.log(JSON.stringify(gestoresAdmin, null, 2));


