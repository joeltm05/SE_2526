
const { faker } = require("@faker-js/faker");

function generateAssincrono() {
  return {
    id: faker.number.int({ min: 1, max: 100 }),
    curso: faker.number.int({ min: 1, max: 50 }), // Assuming curso IDs are between 1 and 50
    link_recurso: faker.internet.url(),
  };
}

const numRecords = 5;
const assincronos = Array.from({ length: numRecords }, generateAssincrono);

console.log(JSON.stringify(assincronos, null, 2));


