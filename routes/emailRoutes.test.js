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

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** POST /email*/

describe("POST /email", function () {
    test("successfully sends a email to us without logging in", async function () {
        const resp = await request(app)
            .post(`/email`)
            .send({
                data: "test sending email",
            });
        console.log('response is', resp.body)
        expect(resp.body).toEqual('sent')
    });

    test("fails to send email if message not present", async function () {
        const resp = await request(app)
            .post(`/email`)
            .send({

            });
        console.log('response is', resp.body)
        expect(resp.body.error.message).toEqual('no data')
    });


});

