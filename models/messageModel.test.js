"use strict";

const { enabled } = require("../app.js");
const db = require("../db.js");
const { BadRequestError, NotFoundError, UnauthorizedError, ExpressError } = require('../error.js')
const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll
} = require("./_testCommon");
const Message = require("./messageModel.js");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** sendMsg */

describe("sendMsg", function () {

    test("works", async function () {


        let message = await Message.sendMsg(process.env.u1Id, 'testuser2', 'Hi, this is testuser1');

        expect(message.msg).toEqual('Hi, this is testuser1');
        expect(message.from_user_id).toEqual(+process.env.u1Id);
        expect(message.to_user_id).toEqual(+process.env.u2Id);

    });

    test("error with not found username", async function () {
        try {
            let message = await Message.sendMsg(process.env.u1Id, 'testuser23', 'Hi, this is testuser1');

        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });

    test("error with not found userid", async function () {
        try {
            let message = await Message.sendMsg('23', 'testuser23', 'Hi, this is testuser1');

        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });

    test("error with no message", async function () {
        try {
            let message = await Message.sendMsg(process.env.u1Id, 'testuser2');

        } catch (err) {

            expect('null value in column "msg" violates not-null constraint').toBeTruthy();
        }
    });

    test("cannot send if user is blocked by logged in user", async function () {

        const block = await db.query(`
        INSERT INTO blocked_users (user_id,blocked_user_id) values
        (${+process.env.u1Id},${+process.env.u2Id})`)

        try {
            let message = await Message.sendMsg(process.env.u1Id, 'testuser2', 'Hi, this is testuser1');
        } catch (e) {

            expect(e instanceof ExpressError).toBeTruthy();
        }


    });


    test("cannot send to user who blocked you", async function () {


        const block = await db.query(`
        INSERT INTO blocked_users (user_id,blocked_user_id) values
        (${+process.env.u2Id},${+process.env.u1Id})`)


        try {
            let message = await Message.sendMsg(process.env.u1Id, 'testuser2', 'Hi, this is testuser1');
        } catch (e) {

            expect(e instanceof ExpressError).toBeTruthy();
        }


    });
});


describe("getLatestMessageList", function () {

    test("works", async function () {

        await db.query(
            `INSERT INTO messages (from_user_id,to_user_id,msg)
            VALUES(${process.env.u1Id},${process.env.u2Id},'from 1 to 2'),
            (${process.env.u3Id},${process.env.u1Id},'from 3 to 1')
            `
        )

        let message = await Message.getLatestMessageList(process.env.u1Id);
        expect(message.length).toEqual(2);

    });

    test("error with invalid id", async function () {

        await db.query(
            `INSERT INTO messages (from_user_id,to_user_id,msg)
            VALUES(${process.env.u1Id},${process.env.u2Id},'from 1 to 2'),
            (${process.env.u3Id},${process.env.u1Id},'from 3 to 1')
            `
        )
        try {
            let message = await Message.getLatestMessageList(23);
        } catch (e) {
            console.log(err)
            expect(err instanceof NotFoundError).toBeTruthy();
        }

    });

    test("error with no id", async function () {

        await db.query(
            `INSERT INTO messages (from_user_id,to_user_id,msg)
            VALUES(${process.env.u1Id},${process.env.u2Id},'from 1 to 2'),
            (${process.env.u3Id},${process.env.u1Id},'from 3 to 1')
            `
        )
        try {
            let message = await Message.getLatestMessageList();
        } catch (e) {
            console.log(err)
            expect(err instanceof NotFoundError).toBeTruthy();
        }

    });
});

describe("getMessages", function () {

    test("works", async function () {

        await db.query(
            `INSERT INTO messages (from_user_id,to_user_id,msg)
        VALUES(${process.env.u1Id},${process.env.u2Id},'from 1 to 2'),
        (${process.env.u1Id},${process.env.u2Id},'from 1 to 2 v2'),
        (${process.env.u1Id},${process.env.u2Id},'from 1 to 2 v3'),
        (${process.env.u1Id},${process.env.u2Id},'from 1 to 2 v4'),
        (${process.env.u3Id},${process.env.u1Id},'from 3 to 1')
        `
        )

        let message = await Message.getMessages('testuser2', process.env.u1Id, 'testuser1');
        expect(message.length).toEqual(4);

    });

    test("works for messaging a new user (no messages associated with it, returning only avatar and username)", async function () {


        let message = await Message.getMessages('testuser2', process.env.u1Id, 'testuser1');
        expect(message.length).toEqual(1);
        expect(message[0].to).toEqual('testuser2')

    });

    test("error when invalid username", async function () {

        await db.query(
            `INSERT INTO messages (from_user_id,to_user_id,msg)
        VALUES(${process.env.u1Id},${process.env.u2Id},'from 1 to 2'),
        (${process.env.u1Id},${process.env.u2Id},'from 1 to 2 v2'),
        (${process.env.u1Id},${process.env.u2Id},'from 1 to 2 v3'),
        (${process.env.u1Id},${process.env.u2Id},'from 1 to 2 v4'),
        (${process.env.u3Id},${process.env.u1Id},'from 3 to 1')
        `
        )
        try {
            let message = await Message.getMessages('testuser23', process.env.u1Id, 'testuser1');
        } catch (e) {

            expect(e instanceof NotFoundError).toBeTruthy();
        }
    });

    test("sets flag to 'read' for logged in user", async function () {

        await db.query(
            `INSERT INTO messages (from_user_id,to_user_id,msg)
        VALUES(${process.env.u1Id},${process.env.u2Id},'from 1 to 2'),
        (${process.env.u1Id},${process.env.u2Id},'from 1 to 2 v2'),
        (${process.env.u1Id},${process.env.u2Id},'from 1 to 2 v3'),
        (${process.env.u1Id},${process.env.u2Id},'from 1 to 2 v4'),
        (${process.env.u3Id},${process.env.u1Id},'from 3 to 1')
        `
        )

        let message = await Message.getMessages('testuser1', process.env.u2Id, 'testuser2');

        const result = await db.query(
            `SELECT * from messages 
                WHERE to_user_id=${process.env.u2Id}`
        )

        expect(result.rows[0].read).toEqual(true)
        expect(result.rows[1].read).toEqual(true)
        expect(result.rows[2].read).toEqual(true)
        expect(result.rows[3].read).toEqual(true)


    });

});
