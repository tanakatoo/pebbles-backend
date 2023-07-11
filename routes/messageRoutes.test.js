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

/************************************** POST /messages/:username/send */

describe("POST /messages/:username/send", function () {
    // test("successfully sends a message to another user", async function () {
    //     const resp = await request(app)
    //         .post(`/messages/testuser2/send`)
    //         .send({
    //             msg: "user 1 to user 2",
    //         })
    //         .set("authorization", `Bearer ${process.env.u1Token}`);
    //     console.log('response is', resp.body)
    //     expect(resp.body.from_user_id).toEqual(+process.env.u1Id);
    //     expect(resp.body.to_user_id).toEqual(+process.env.u2Id);
    //     expect(resp.body.msg).toEqual('user 1 to user 2');
    // });

    test("cannot send to a user who blocked you", async function () {

        const block = await db.query(`
        INSERT INTO blocked_users (user_id,blocked_user_id) values
        (${+process.env.u2Id},${+process.env.u1Id})`)


        const resp = await request(app)
            .post(`/messages/testuser2/send`)
            .send({
                msg: "user 1 to user 2",
            })
            .set("authorization", `Bearer ${process.env.u1Token}`);

        expect(resp.body.error.message).toEqual('blocked');

    });


    test("cannot send to a user who you blocked", async function () {

        const block = await db.query(`
        INSERT INTO blocked_users (user_id,blocked_user_id) values
        (${+process.env.u1Id},${+process.env.u2Id})`)


        const resp = await request(app)
            .post(`/messages/testuser2/send`)
            .send({
                msg: "user 1 to user 2",
            })
            .set("authorization", `Bearer ${process.env.u1Token}`);

        expect(resp.body.error.message).toEqual('blocked');

    });

    test("cannot send if msg is missing", async function () {

        const resp = await request(app)
            .post(`/messages/testuser2/send`)
            .send({
                noData: "user 1 to user 2",
            })
            .set("authorization", `Bearer ${process.env.u1Token}`);

        expect(resp.status).toEqual(400);
        expect(resp.body.error.message).toEqual('not a valid type');
    });

    test("error if msg is not a string", async function () {

        const resp = await request(app)
            .post(`/messages/testuser2/send`)
            .send({
                msg: { noway: 'cannotBeSent' },
            })
            .set("authorization", `Bearer ${process.env.u1Token}`);

        expect(resp.body.error.message).toEqual('not a valid type');
    });
});


/************************************** GET /messages */

describe("GET /messages/", function () {
    test("successfully gets the latest messages for logged in user", async function () {
        await db.query(
            `INSERT INTO messages (from_user_id,to_user_id,msg)
            VALUES(${process.env.u1Id},${process.env.u2Id},'from 1 to 2'),
            (${process.env.u3Id},${process.env.u1Id},'from 3 to 1')
            `
        )

        const resp = await request(app)
            .get(`/messages`)
            .set("authorization", `Bearer ${process.env.u1Token}`);

        expect(resp.body.length).toEqual(2);

    });

    test("successfully gets the latest messages for logged in user without blocked user", async function () {
        await db.query(`
        INSERT INTO blocked_users (user_id,blocked_user_id) values
        (${+process.env.u1Id},${+process.env.u2Id})`)

        await db.query(
            `INSERT INTO messages (from_user_id,to_user_id,msg)
            VALUES(${process.env.u1Id},${process.env.u2Id},'from 1 to 2'),
            (${process.env.u3Id},${process.env.u1Id},'from 3 to 1')
            `
        )

        const resp = await request(app)
            .get(`/messages`)
            .set("authorization", `Bearer ${process.env.u1Token}`);


        expect(resp.body.length).toEqual(1);
        expect(resp.body[0].msg).toEqual('from 3 to 1');

    });


    test("successfully gets the latest messages with user who blocked  logged in user", async function () {
        await db.query(`
        INSERT INTO blocked_users (user_id,blocked_user_id) values
        (${+process.env.u2Id},${+process.env.u1Id})`)

        await db.query(
            `INSERT INTO messages (from_user_id,to_user_id,msg)
            VALUES(${process.env.u1Id},${process.env.u2Id},'from 1 to 2'),
            (${process.env.u3Id},${process.env.u1Id},'from 3 to 1')
            `
        )

        const resp = await request(app)
            .get(`/messages`)
            .set("authorization", `Bearer ${process.env.u1Token}`);


        expect(resp.body.length).toEqual(2);

    });

    test("unauthorized if not logged in", async function () {
        await db.query(`
        INSERT INTO blocked_users (user_id,blocked_user_id) values
        (${+process.env.u2Id},${+process.env.u1Id})`)

        await db.query(
            `INSERT INTO messages (from_user_id,to_user_id,msg)
            VALUES(${process.env.u1Id},${process.env.u2Id},'from 1 to 2'),
            (${process.env.u3Id},${process.env.u1Id},'from 3 to 1')
            `
        )

        const resp = await request(app)
            .get(`/messages`)

        expect(resp.body.error.message).toEqual("UNAUTHORIZED");

    });



});



/************************************** GET /:username */

describe("GET /messages/:username/", function () {

    test("successfully gets all messages with 1 user", async function () {

        await db.query(
            `INSERT INTO messages (from_user_id,to_user_id,msg)
        VALUES(${process.env.u1Id},${process.env.u2Id},'from 1 to 2'),
        (${process.env.u1Id},${process.env.u2Id},'from 1 to 2 v2'),
        (${process.env.u1Id},${process.env.u2Id},'from 1 to 2 v3'),
        (${process.env.u1Id},${process.env.u2Id},'from 1 to 2 v4'),
        (${process.env.u3Id},${process.env.u1Id},'from 3 to 1')
        `
        )

        const resp = await request(app)
            .get(`/messages/testuser2`)
            .set("authorization", `Bearer ${process.env.u1Token}`);


        expect(resp.body.length).toEqual(4);

    });


    test("unauthorized if not logged in", async function () {

        await db.query(
            `INSERT INTO messages (from_user_id,to_user_id,msg)
        VALUES(${process.env.u1Id},${process.env.u2Id},'from 1 to 2'),
        (${process.env.u1Id},${process.env.u2Id},'from 1 to 2 v2'),
        (${process.env.u1Id},${process.env.u2Id},'from 1 to 2 v3'),
        (${process.env.u1Id},${process.env.u2Id},'from 1 to 2 v4'),
        (${process.env.u3Id},${process.env.u1Id},'from 3 to 1')
        `
        )

        const resp = await request(app)
            .get(`/messages/testuser2`)

        expect(resp.body.error.message).toEqual("UNAUTHORIZED");

    });

    test("cannot get messages if you blocked user", async function () {

        await db.query(`
        INSERT INTO blocked_users (user_id,blocked_user_id) values
        (${+process.env.u1Id},${+process.env.u2Id})`)

        await db.query(
            `INSERT INTO messages (from_user_id,to_user_id,msg)
        VALUES(${process.env.u1Id},${process.env.u2Id},'from 1 to 2'),
        (${process.env.u1Id},${process.env.u2Id},'from 1 to 2 v2'),
        (${process.env.u1Id},${process.env.u2Id},'from 1 to 2 v3'),
        (${process.env.u1Id},${process.env.u2Id},'from 1 to 2 v4'),
        (${process.env.u3Id},${process.env.u1Id},'from 3 to 1')
        `
        )

        const resp = await request(app)
            .get(`/messages/testuser2`)
            .set("authorization", `Bearer ${process.env.u1Token}`);

        expect(resp.body.error.message).toEqual("blocked");

    });



    test("successfully gets messages even if user blocked you", async function () {

        await db.query(`
        INSERT INTO blocked_users (user_id,blocked_user_id) values
        (${+process.env.u2Id},${+process.env.u1Id})`)

        await db.query(
            `INSERT INTO messages (from_user_id,to_user_id,msg)
        VALUES(${process.env.u1Id},${process.env.u2Id},'from 1 to 2'),
        (${process.env.u1Id},${process.env.u2Id},'from 1 to 2 v2'),
        (${process.env.u1Id},${process.env.u2Id},'from 1 to 2 v3'),
        (${process.env.u1Id},${process.env.u2Id},'from 1 to 2 v4'),
        (${process.env.u3Id},${process.env.u1Id},'from 3 to 1')
        `
        )

        const resp = await request(app)
            .get(`/messages/testuser2`)
            .set("authorization", `Bearer ${process.env.u1Token}`);

        expect(resp.body.length).toEqual(4);

    });
});