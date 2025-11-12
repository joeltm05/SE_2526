
const { faker } = require("@faker-js/faker");

function generateInscricao() {
  return {
    formando: faker.number.int({ min: 1, max: 50 }), // Assuming formando IDs are between 1 and 50
    curso: faker.number.int({ min: 1, max: 50 }), // Assuming curso IDs are between 1 and 50
    avaliacao: faker.number.int({ min: 1, max: 100 }), // Assuming avaliacao IDs are between 1 and 100
    data_inscricao: faker.date.past().toISOString(),
    certificado_gerado: faker.datatype.boolean(),
    avaliacao_status: faker.datatype.boolean(),
  };
}

const numRecords = 5;
const inscricoes = Array.from({ length: numRecords }, generateInscricao);

console.log(JSON.stringify(inscricoes, null, 2));


