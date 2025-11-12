
const { faker } = require("@faker-js/faker");

function generateTopico() {
  return {
    descricao: faker.lorem.sentence(),
    data_criacao: faker.date.past().toISOString(),
    contexto: faker.lorem.paragraph(),
    denuncia_flag: faker.datatype.boolean(),
    reward: faker.number.int({ min: 0, max: 1000 }),
    area: faker.number.int({ min: 1, max: 10 }), // Assuming area IDs are between 1 and 10
  };
}

const numRecords = 5;
const topicos = Array.from({ length: numRecords }, generateTopico);

console.log(JSON.stringify(topicos, null, 2));


