
const { faker } = require("@faker-js/faker");

function generateFormador() {
  return {
    utilizador: faker.number.int({ min: 1, max: 200 }), // Assuming utilizador IDs are between 1 and 200
    grau_academico: faker.lorem.word({ length: { min: 5, max: 25 } }),
    n_cursos: faker.number.int({ min: 0, max: 50 }),
    score: faker.number.int({ min: 0, max: 100 }),
    percurso_academico: faker.lorem.paragraph(),
  };
}

const numRecords = 5;
const formadores = Array.from({ length: numRecords }, generateFormador);

console.log(JSON.stringify(formadores, null, 2));


