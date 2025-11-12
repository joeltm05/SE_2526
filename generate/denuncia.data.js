
const { faker } = require("@faker-js/faker");

function generateDenuncia() {
  return {
    utilizador: faker.number.int({ min: 1, max: 200 }), // Assuming utilizador IDs are between 1 and 200
    post: faker.number.int({ min: 1, max: 100 }), // Assuming post IDs are between 1 and 100
    razao: faker.lorem.sentence(),
    data_denuncia: faker.date.past().toISOString(),
    tipo_denuncia: faker.number.int({ min: 1, max: 5 }), // Assuming tipo_denuncia IDs are between 1 and 5
  };
}

const numRecords = 5;
const denuncias = Array.from({ length: numRecords }, generateDenuncia);

console.log(JSON.stringify(denuncias, null, 2));


