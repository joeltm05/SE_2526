
const { faker } = require("@faker-js/faker");

function generateCurso() {
  const diaInicio = faker.date.past();
  const diaFim = faker.date.future({ years: 1, refDate: diaInicio });
  return {
    nome: faker.lorem.words(3),
    descricao: faker.lorem.sentence(),
    duracao: faker.number.float({ min: 10, max: 200, precision: 0.5 }),
    dia_inicio: diaInicio.toISOString(),
    dia_fim: diaFim.toISOString(),
    status: faker.datatype.boolean(),
    nivel: faker.helpers.arrayElement(['Iniciante', 'Intermediário', 'Avançado']),
    linguagem: faker.helpers.arrayElement(['Português', 'Inglês', 'Espanhol']),
    tipo: faker.helpers.arrayElement(['Online', 'Presencial', 'Híbrido']),
    progresso: faker.number.int({ min: 0, max: 100 }),
    ocorrencias: faker.number.int({ min: 0, max: 10 }),
    abreviacao: faker.string.alphanumeric(5).toUpperCase(),
    visivel_cursos: faker.datatype.boolean(),
    ultima_atualizacao: faker.date.recent().toISOString(),
    n_ficheiros_material: faker.number.int({ min: 0, max: 20 }),
    n_ficheiros_avaliacao: faker.number.int({ min: 0, max: 10 }),
    gestor_admin: faker.number.int({ min: 1, max: 5 }), // Assuming gestor_admin IDs are between 1 and 5
    topico: faker.number.int({ min: 1, max: 15 }), // Assuming topico IDs are between 1 and 15
  };
}

const numRecords = 5;
const cursos = Array.from({ length: numRecords }, generateCurso);

console.log(JSON.stringify(cursos, null, 2));


