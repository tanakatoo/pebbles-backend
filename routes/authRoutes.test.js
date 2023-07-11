"use strict";

const request = require("supertest");
const db = require('../db')
const app = require("../app");

const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    getTokens
} = require("./_testCommon");

beforeAll(commonBeforeAll);
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
        // await getTokens()

        const resp = await request(app)
            .post("/auth/set-password")
            .send({
                password: "newpassword",
                token: process.env.u1Token,
                lang: "EN"
            });
        expect(resp.statusCode).toEqual(201);
        expect(resp.body).toEqual({
            "user": expect.any(Object),
            "token": expect.any(String),
        });

    });

    test("bad request with missing token", async function () {
        const resp = await request(app)
            .post("/auth/set-password")
            .send({
                password: "newpassword",
                lang: "EN"
            });
        expect(resp.statusCode).toEqual(400);
    });

    test("bad request with invalid data", async function () {
        const resp = await request(app)
            .post("/auth/set-password")
            .send({
                password: "newpassword",
                token: process.env.u1Token
            });
        expect(resp.statusCode).toEqual(400);
    });
});



/************************************** POST /auth/change-password */

describe("POST /auth/set-password", function () {
    test("works with email", async function () {
        await getTokens()

        const resp = await request(app)
            .post("/auth/change-password")
            .send({
                username: "usertest1@test.com",
                lang: "EN"
            });
        expect(resp.statusCode).toEqual(201);
        expect(resp.body).toEqual('completed');

    });

    test("works with username", async function () {
        await getTokens()

        const resp = await request(app)
            .post("/auth/change-password")
            .send({
                username: "usertest1",
                lang: "EN"
            });
        expect(resp.statusCode).toEqual(201);
        expect(resp.body).toEqual('completed');

    });


    test("bad request with missing information", async function () {
        const resp = await request(app)
            .post("/auth/change-password")
            .send({
                lang: "EN"
            });
        expect(resp.statusCode).toEqual(400);
    });

    test("bad request with invalid data", async function () {
        const resp = await request(app)
            .post("/auth/change-password")
            .send({
                username: 123,
                lang: "EN"
            });
        expect(resp.statusCode).toEqual(400);
    });
});
