
const { faker } = require("@faker-js/faker");

function generateConteudoCurso() {
  return {
    curso: faker.number.int({ min: 1, max: 50 }), // Assuming curso IDs are between 1 and 50
    tipo_conteudo: faker.number.int({ min: 1, max: 5 }), // Assuming tipo_conteudo IDs are between 1 and 5
    descricao: faker.lorem.sentence(),
    data_upload: faker.date.past().toISOString(),
    tamanho_ficheiro: faker.number.int({ min: 100, max: 100000 }),
    nome: faker.lorem.words(3),
    visivel: faker.datatype.boolean(),
    disponibiliazado: faker.datatype.boolean(),
    duracao_conteudo: faker.number.int({ min: 1, max: 600 }),
  };
}

const numRecords = 5;
const conteudosCurso = Array.from({ length: numRecords }, generateConteudoCurso);

console.log(JSON.stringify(conteudosCurso, null, 2));


