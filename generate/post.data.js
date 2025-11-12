
const { faker } = require("@faker-js/faker");

function generatePost() {
  return {
    utilizador: faker.number.int({ min: 1, max: 200 }), // Assuming utilizador IDs are between 1 and 200
    topico: faker.number.int({ min: 1, max: 15 }), // Assuming topico IDs are between 1 and 15
    curso: faker.number.int({ min: 1, max: 50 }), // Assuming curso IDs are between 1 and 50
    conteudo: faker.lorem.paragraph(),
    data_criacao: faker.date.past().toISOString(),
    denuncia: faker.datatype.boolean(),
    reward: faker.number.int({ min: 0, max: 1000 }),
  };
}

const numRecords = 5;
const posts = Array.from({ length: numRecords }, generatePost);

console.log(JSON.stringify(posts, null, 2));


