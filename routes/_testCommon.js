"use strict";

const db = require("../db.js");
const User = require("../models/userModel");

const Message = require("../models/messageModel");

const StudyBuddy = require("../models/studybuddyModel");

const { generateToken } = require("../helpers/token");



async function commonBeforeAll() {

    await db.query("DELETE FROM users");
    await db.query("DELETE FROM cities");
    await db.query("DELETE FROM countries");
    await db.query("DELETE FROM states");
    await db.query("DELETE FROM messages");
    await db.query("DELETE FROM study_buddy_types_users");
    await db.query("DELETE FROM goals_users");
    await db.query("DELETE FROM blocked_users");
    await db.query("DELETE FROM saved");



    await User.register(
        {
            username: "testuser1",
            password: "asdfasdf",
            email: 'testuser1@test.com'
        });

    await User.register(
        {
            username: "testuser2",
            password: "asdfasdf",
            email: 'testuser2@test.com'
        });

    await User.register(
        {
            username: "testuser3",
            password: "asdfasdf",
            email: 'testuser3@test.com'
        });

    await User.register(
        {
            username: "admin",
            password: "asdfasdf",
            email: 'admin@test.com'
        });

    await db.query(`UPDATE users SET role='admin' where username='admin'`)

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
    getTokens,
    setLocation
};
