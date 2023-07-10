"use strict";

const db = require("../db.js");
const User = require("../models/userModel");
const City = require("../models/cityModel");
const Country = require("../models/countryModel");
const Message = require("../models/messageModel");
const State = require("../models/stateModel");
const StudyBuddy = require("../models/studybuddyModel");

const { generateToken } = require("../helpers/token");



async function commonBeforeAll() {

    await db.query("DELETE FROM users");
    await db.query("DELETE FROM cities");
    await db.query("DELETE FROM countries");
    await db.query("DELETE FROM states");
    await db.query("DELETE FROM messages");

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
    getTokens
};
