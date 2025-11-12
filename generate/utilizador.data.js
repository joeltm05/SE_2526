
const { faker } = require("@faker-js/faker");

function generateUtilizador() {
  return {
    username: faker.internet.userName().substring(0, 50),
    nome: faker.person.fullName().substring(0, 100),
    telemovel: faker.phone.number("##########").substring(0, 14),
    email: faker.internet.email().substring(0, 50),
    password: faker.internet.password(),
    endereco: faker.location.streetAddress(),
    papel: faker.helpers.arrayElement(["admin", "formador", "formando"]),
    data_nascimento: faker.date.past({ years: 30 }).toISOString(),
    sexo: faker.helpers.arrayElement(["M", "F"]),
    criacao: faker.date.past({ years: 5 }).toISOString(),
    papel_date: faker.date.recent().toISOString(),
    descricao: faker.lorem.paragraph(),
  };
}

const numRecords = 5;
const utilizadores = Array.from({ length: numRecords }, generateUtilizador);

console.log(JSON.stringify(utilizadores, null, 2));


