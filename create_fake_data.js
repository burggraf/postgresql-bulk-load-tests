"use strict";
exports.__esModule = true;
exports.createRandomUser = exports.USERS = void 0;
var faker_1 = require("@faker-js/faker");
var fs = require("fs");
exports.USERS = [];
// generate a random number from 0 to 100
var randomNumber = function () { return Math.floor(Math.random() * 100); };
function createRandomUser() {
    return {
        userid: faker_1.faker.datatype.uuid(),
        firstname: faker_1.faker.name.firstName(),
        lastname: faker_1.faker.name.lastName(),
        score: Math.floor(Math.random() * 100),
        username: faker_1.faker.internet.userName(),
        email: faker_1.faker.internet.email().toLowerCase(),
        avatar: faker_1.faker.image.avatar(),
        company: faker_1.faker.company.companyName(),
        password: faker_1.faker.internet.password(),
        birthdate: new Date(faker_1.faker.date.birthdate()).toISOString(),
        registered_at: new Date(faker_1.faker.date.past()).toISOString()
    };
}
exports.createRandomUser = createRandomUser;
Array.from({ length: 100000 }).forEach(function () {
    exports.USERS.push(createRandomUser());
});
// convert to SQL insert statement
var SQL_INSERT_STATEMENT = exports.USERS
    .map(function (user) {
    return "('".concat(user.userid, "', '").concat(user.firstname.replace(/'/g, "''"), "', '").concat(user.lastname.replace(/'/g, "''"), "', ").concat(user.score, ", '").concat(user.username.replace(/'/g, "''"), "', '").concat(user.email, "', '").concat(user.avatar.replace(/'/g, "''"), "', '").concat(user.company.replace(/'/g, "''"), "', '").concat(user.password.replace(/'/g, "''"), "', '").concat(user.birthdate, "', '").concat(user.registered_at, "')");
})
    .join(',\n');
var SQL_INSERT_STATEMENT_SINGLE = exports.USERS
    .map(function (user) {
    return "INSERT INTO users (userid, firstname, lastname, score, username, email, avatar, company, password, birthdate, registered_at) VALUES ('".concat(user.userid, "', '").concat(user.firstname.replace(/'/g, "''"), "', '").concat(user.lastname.replace(/'/g, "''"), "', ").concat(user.score, ", '").concat(user.username.replace(/'/g, "''"), "', '").concat(user.email, "', '").concat(user.avatar.replace(/'/g, "''"), "', '").concat(user.company.replace(/'/g, "''"), "', '").concat(user.password.replace(/'/g, "''"), "', '").concat(user.birthdate, "', '").concat(user.registered_at, "');\n");
})
    .join('');
// write to file
var sqlFile = "INSERT INTO users (userid, firstname, lastname, score, username, email, avatar, company, password, birthdate, registered_at) VALUES\n".concat(SQL_INSERT_STATEMENT, ";");
fs.writeFileSync('users_batch.sql', sqlFile);
fs.writeFileSync('users_batch_transaction.sql', "BEGIN TRANSACTION;\n".concat(sqlFile, ";\nCOMMIT;\n"));
fs.writeFileSync('users_single.sql', SQL_INSERT_STATEMENT_SINGLE);
fs.writeFileSync('users_single_transaction.sql', "BEGIN TRANSACTION;\n".concat(SQL_INSERT_STATEMENT_SINGLE, ";\nCOMMIT;\n"));
fs.writeFileSync('users_create.sql', "\n  DROP TABLE IF EXISTS users;\n  CREATE TABLE users (\n    \"userid\" \"uuid\" DEFAULT \"gen_random_uuid\"(),\n    \"firstname\" \"text\",\n    \"lastname\" \"text\",\n    \"score\" integer,\n    \"username\" \"text\",\n    \"email\" \"text\",\n    \"avatar\" \"text\",\n    \"company\" \"text\",\n    \"password\" \"text\",\n    \"birthdate\" timestamp without time zone,\n    \"registered_at\" timestamp without time zone\n);\n");
console.log('done');
