
const { faker } = require("@faker-js/faker");

function generateFile() {
  return {
    name: faker.system.fileName(),
    extension: faker.system.fileExt(),
    upload_date: faker.date.past().toISOString(),
    type: faker.system.fileType(),
  };
}

const numRecords = 5;
const files = Array.from({ length: numRecords }, generateFile);

console.log(JSON.stringify(files, null, 2));


