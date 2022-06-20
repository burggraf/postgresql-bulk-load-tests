import { faker } from '@faker-js/faker';
import * as fs from 'fs';
export const USERS: any[] = [];

// generate a random number from 0 to 100
const randomNumber = (): number => Math.floor(Math.random() * 100);

export function createRandomUser(): any {
  return {
    userid: faker.datatype.uuid(),
    firstname: faker.name.firstName(),
    lastname: faker.name.lastName(),
    score: Math.floor(Math.random() * 100),
    username: faker.internet.userName(),
    email: faker.internet.email().toLowerCase(),
    avatar: faker.image.avatar(),
    company: faker.company.companyName(),
    password: faker.internet.password(),
    birthdate: new Date(faker.date.birthdate()).toISOString(),
    registered_at: new Date(faker.date.past()).toISOString(),
  };
}

Array.from({ length: 100000 }).forEach(() => {
  USERS.push(createRandomUser());
});

// convert to SQL insert statement
const SQL_INSERT_STATEMENT = USERS
  .map((user) => {
    return `('${user.userid}', '${user.firstname.replace(/'/g,"''")}', '${user.lastname.replace(/'/g,"''")}', ${user.score}, '${user.username.replace(/'/g,"''")}', '${user.email}', '${user.avatar.replace(/'/g,"''")}', '${user.company.replace(/'/g,"''")}', '${user.password.replace(/'/g,"''")}', '${user.birthdate}', '${user.registered_at}')`;
  }
  )
  .join(',\n');
const SQL_INSERT_STATEMENT_SINGLE = USERS
  .map((user) => {
    return `INSERT INTO users (userid, firstname, lastname, score, username, email, avatar, company, password, birthdate, registered_at) VALUES ('${user.userid}', '${user.firstname.replace(/'/g,"''")}', '${user.lastname.replace(/'/g,"''")}', ${user.score}, '${user.username.replace(/'/g,"''")}', '${user.email}', '${user.avatar.replace(/'/g,"''")}', '${user.company.replace(/'/g,"''")}', '${user.password.replace(/'/g,"''")}', '${user.birthdate}', '${user.registered_at}');\n`;
  }
  )
  .join('');


  // write to file
  const sqlFile = `INSERT INTO users (userid, firstname, lastname, score, username, email, avatar, company, password, birthdate, registered_at) VALUES\n${SQL_INSERT_STATEMENT};`;
  fs.writeFileSync('users_batch.sql', sqlFile);
  fs.writeFileSync('users_batch_transaction.sql', `BEGIN TRANSACTION;\n${sqlFile};\nCOMMIT;\n`);
  fs.writeFileSync('users_single.sql', SQL_INSERT_STATEMENT_SINGLE);
  fs.writeFileSync('users_single_transaction.sql', `BEGIN TRANSACTION;\n${SQL_INSERT_STATEMENT_SINGLE};\nCOMMIT;\n`);
  fs.writeFileSync('users_create.sql', `
  DROP TABLE IF EXISTS users;
  CREATE TABLE users (
    "userid" "uuid" DEFAULT "gen_random_uuid"(),
    "firstname" "text",
    "lastname" "text",
    "score" integer,
    "username" "text",
    "email" "text",
    "avatar" "text",
    "company" "text",
    "password" "text",
    "birthdate" timestamp without time zone,
    "registered_at" timestamp without time zone
);\n`);
  console.log('done');
  
