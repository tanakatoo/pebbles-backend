const bcrypt = require("bcrypt");

const db = require("../db.js");
const { BCRYPT_WORK_FACTOR } = require("../config");
const { generateToken } = require('../helpers/token.js')
const testJobIds = [];

async function commonBeforeAll() {

    await db.query("DELETE FROM users");
    await db.query("DELETE FROM cities");
    await db.query("DELETE FROM countries");
    await db.query("DELETE FROM states");
    await db.query("DELETE FROM messages");

    await db.query(`
  INSERT INTO users(username, password,email,role,sign_up_date,last_login_date,language_preference, gender_id) 
VALUES ('testuser1','$2b$12$LCkeEtenLBV490vZDhi6gOwA67qVD9UfYyhdVSkKdqvvQAGDWDHf6','testuser1@test.com','regular','2023-05-01','2023-05-01',1,1),
 ('testuser2','$2b$12$LCkeEtenLBV490vZDhi6gOwA67qVD9UfYyhdVSkKdqvvQAGDWDHf6','testuser2@test.com','regular','2023-05-01','2023-05-01',1,1),
 ('testuser3','$2b$12$LCkeEtenLBV490vZDhi6gOwA67qVD9UfYyhdVSkKdqvvQAGDWDHf6','testuser3@test.com','regular','2023-05-01','2023-05-01',1,1),
  ('admin','$2b$12$LCkeEtenLBV490vZDhi6gOwA67qVD9UfYyhdVSkKdqvvQAGDWDHf6','admin@test.com','admin','2023-05-01','2023-05-01',1,1);
`);

    await getTokens()
    await setLocation()

}


async function getTokens() {
    //get the ids for the 3 mock users
    const allIDs = await db.query('select id from users')

    process.env.u1Token = generateToken(allIDs.rows[0].id, "testuser1");
    process.env.u2Token = generateToken(allIDs.rows[1].id, "testuser2");
    process.env.u3Token = generateToken(allIDs.rows[2].id, "testuser3");
    process.env.adminToken = generateToken(allIDs.rows[3].id, "admin");
    process.env.u1Id = allIDs.rows[0].id
    process.env.u2Id = allIDs.rows[1].id
    process.env.u3Id = allIDs.rows[2].id
    process.env.admin = allIDs.rows[3].id

}

async function setLocation() {

    const country = await db.query(`insert into countries (name_en, name_ja) values ('Canada','カナダ') returning id`)
    const state = await db.query(`insert into states (name_en, name_ja) values ('Ontario','オンタリオ') returning id`)
    const city = await db.query(`insert into cities (name_en,name_ja) values ('Waterloo','ウォータールー') returning id`)
    process.env.countryId = country.rows[0].id
    process.env.stateId = state.rows[0].id
    process.env.cityId = city.rows[0].id

}

async function commonBeforeEach() {
    await db.query("BEGIN");
}

async function commonAfterEach() {
    await db.query("ROLLBACK");
}

async function commonAfterAll() {
    await db.end();
}


module.exports = {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    testJobIds,
};