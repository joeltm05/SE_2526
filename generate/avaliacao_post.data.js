
const { faker } = require("@faker-js/faker");

function generateAvaliacaoPost() {
  return {
    post: faker.number.int({ min: 1, max: 100 }), // Assuming post IDs are between 1 and 100
    utilizador: faker.number.int({ min: 1, max: 200 }), // Assuming utilizador IDs are between 1 and 200
    avaliacao_post: faker.datatype.boolean(),
    data_avaliacao: faker.date.past().toISOString(),
  };
}

const numRecords = 5;
const avaliacoesPost = Array.from({ length: numRecords }, generateAvaliacaoPost);

console.log(JSON.stringify(avaliacoesPost, null, 2));


