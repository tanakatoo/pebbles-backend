"use strict";

const request = require("supertest");
const db = require('../db')
const app = require("../app");

const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll
} = require("./_testCommon");

beforeAll(async () => {
    commonBeforeAll()

    //get the ids for the 3 mock users
    const allIDs = await db.query('select id from users')
    console.log('this is all id', allIDs)
    const u1Token = generateToken(allIDs.rows[0].id, "testuser1");
    const u2Token = generateToken(allIDs.rows[1].id, "testuser2");
    const u3Token = generateToken(allIDs.rows[2].id, "testuser3");


    console.log('token is', u1Token)
});

beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** POST /auth/login */

describe("POST /auth/login", function () {
    test("works", async function () {
        const resp = await request(app)
            .post("/auth/login")
            .send({
                username: "testuser1",
                password: "asdfasdf",
            });
        console.log(resp.body)
        expect(resp.body).toEqual({
            "user": expect.any(Object),
            "token": expect.any(String),
        });
    });

    test("unauth with non-existent user", async function () {
        const resp = await request(app)
            .post("/auth/login")
            .send({
                username: "no-such-user",
                password: "password1",
            });
        expect(resp.statusCode).toEqual(401);
    });

    test("unauth with wrong password", async function () {
        const resp = await request(app)
            .post("/auth/login")
            .send({
                username: "testuser1",
                password: "thisiswrong",
            });
        expect(resp.statusCode).toEqual(401);
    });

    test("bad request with missing data", async function () {
        const resp = await request(app)
            .post("/auth/login")
            .send({
                username: "testuser1",
            });
        expect(resp.statusCode).toEqual(400);
    });

    test("bad request with invalid data", async function () {
        const resp = await request(app)
            .post("/auth/login")
            .send({
                username: 42,
                password: "above-is-a-number",
            });
        expect(resp.statusCode).toEqual(400);
    });
});

/************************************** POST /auth/register */

describe("POST /auth/register", function () {
    test("works", async function () {
        const resp = await request(app)
            .post("/auth/register")
            .send({
                username: "newOne",
                password: "mypassword",
                email: "hello@test.com",
                lang: "EN"
            });
        expect(resp.statusCode).toEqual(201);
        expect(resp.body).toEqual(expect.any(String));

    });

    test("bad request with missing fields", async function () {
        const resp = await request(app)
            .post("/auth/register")
            .send({
                username: "new",
            });
        expect(resp.statusCode).toEqual(400);
    });

    test("bad request with invalid data", async function () {
        const resp = await request(app)
            .post("/auth/register")
            .send({
                username: "newOne",
                password: "mypassword",
                email: "notAnEmail",
                lang: "EN"
            });
        expect(resp.statusCode).toEqual(400);
    });
});


/************************************** POST /auth/set-password */

describe("POST /auth/set-password", function () {
    test("works", async function () {


        const resp = await request(app)
            .post("/auth/set-password")
            .send({
                password: "newpassword",
                token: u1Token,
                lang: "EN"
            });
        expect(resp.statusCode).toEqual(201);
        expect(resp.body).toEqual({
            "user": expect.any(Object),
            "token": expect.any(String),
        });

    });

    // test("bad request with missing fields", async function () {
    //     const resp = await request(app)
    //         .post("/auth/register")
    //         .send({
    //             username: "new",
    //         });
    //     expect(resp.statusCode).toEqual(400);
    // });

    // test("bad request with invalid data", async function () {
    //     const resp = await request(app)
    //         .post("/auth/register")
    //         .send({
    //             username: "newOne",
    //             password: "mypassword",
    //             email: "notAnEmail",
    //             lang: "EN"
    //         });
    //     expect(resp.statusCode).toEqual(400);
    // });
});
