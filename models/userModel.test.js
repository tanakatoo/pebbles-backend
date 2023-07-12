
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
const User = require("./userModel.js");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

// /************************************** getSearchUsers */

// describe("getSearchUsers", function () {

//     test("works", async function () {
//         //change test user so that it has data and is a study buddy
//         let list = await User.getSearchUsers('testuser1');

//         expect(list.length).toEqual(1);

//     });


//     test("no results return if not found", async function () {
//         //change test user so that it has data and is a study buddy
//         let list = await User.getSearchUsers('testuser23');

//         expect(list.length).toEqual(0);

//     });

//     test("searching in name", async function () {
//         const updated = await db.query(`UPDATE users SET 
//         name='Testing Me' where id=${process.env.u1Id}`)

//         let list = await User.getSearchUsers('Me');

//         expect(list.length).toEqual(1);

//     });

//     test("searching in about", async function () {
//         const updated = await db.query(`UPDATE users SET 
//         about='This is about me' where id=${process.env.u1Id}`)

//         let list = await User.getSearchUsers('This is about me');

//         expect(list.length).toEqual(1);

//     });

//     test("returns all results if no criteria", async function () {
//         const updated = await db.query(`UPDATE users SET 
//         about='This is about me' where id=${process.env.u1Id}`)

//         let list = await User.getSearchUsers('');

//         expect(list.length).toEqual(4);

//     });

// });

// /************************************** getUsersList */

// describe("getUsersList", function () {

//     test("works", async function () {
//         //insert some messages 
//         await db.query(
//             `INSERT INTO messages (from_user_id,to_user_id,msg)
//             VALUES(${process.env.u1Id},${process.env.u2Id},'from 1 to 2'),
//             (${process.env.u3Id},${process.env.u1Id},'from 3 to 1')
//             `
//         )

//         let messages = await User.getUsersList(process.env.u1Id);
//         expect(messages.length).toEqual(2);
//     });

//     test("does not get users that logged in user did not contact before ", async function () {
//         //insert some messages 
//         await db.query(
//             `INSERT INTO messages (from_user_id,to_user_id,msg)
//             VALUES(${process.env.u1Id},${process.env.u2Id},'from 1 to 2'),
//             (${process.env.u2Id},${process.env.u3Id},'from 2 to 3')
//     `
//         )
//         let messages = await User.getUsersList(process.env.u1Id);
//         expect(messages.length).toEqual(1);
//         expect(messages[0].username).not.toEqual('testuser3');

//     });

//     test("does not get users that user has blocked ", async function () {
//         //insert some messages 
//         await db.query(
//             `INSERT INTO messages (from_user_id,to_user_id,msg)
//             VALUES(${process.env.u1Id},${process.env.u2Id},'from 1 to 2'),
//             (${process.env.u1Id},${process.env.u3Id},'from 1 to 3')
//     `
//         )

//         await db.query(`
//         INSERT INTO blocked_users (user_id,blocked_user_id) values
//         (${+process.env.u1Id},${+process.env.u2Id})`)

//         let messages = await User.getUsersList(process.env.u1Id);
//         expect(messages.length).toEqual(1);
//         expect(messages[0].username).not.toEqual('testuser2');

//     });

// });


// /************************************** getRole */

// describe("getRole", function () {

//     test("works for regular", async function () {
//         let role = await User.getRole(process.env.u1Id);
//         expect(role.role).toEqual('regular');
//     });
//     test("works for admin", async function () {
//         let role = await User.getRole(process.env.admin);
//         expect(role.role).toEqual('admin');
//     });
//     test("error if id not found", async function () {
//         try {
//             let role = await User.getRole(23);
//         } catch (e) {
//             expect(e instanceof NotFoundError).toBeTruthy();
//         }


//     });
// });


// /************************************** getBlockedUsers */

// describe("getBlockedUsers", function () {

//     test("works", async function () {
//         await db.query(`
//         INSERT INTO blocked_users (user_id,blocked_user_id) values
//         (${+process.env.u1Id},${+process.env.u2Id}),
//         (${+process.env.u2Id},${+process.env.u3Id})`)

//         let list = await User.getBlockedUsers(process.env.u1Id);
//         expect(list.length).toEqual(1);
//     });

//     test("error if id not found", async function () {
//         try {
//             let role = await User.getRole(23);
//         } catch (e) {
//             expect(e instanceof NotFoundError).toBeTruthy();
//         }


//     });
// });


/************************************** blockUser */

describe("blockUser", function () {

    // test("works", async function () {

    //     let block = await User.blockUser('testuser2', process.env.u1Id);
    //     const result = await db.query(`
    //     SELECT * from blocked_users
    //     `)
    //     expect(result.rows.length).toEqual(1);
    // });

    test("error if id  not found", async function () {
        try {
            let block = await User.blockUser('testuser2', 23);
        } catch (e) {
            console.log(e)
            expect(e).toBeInstanceOf(Error)
        }
    });

    test("error if username not found", async function () {
        try {
            let block = await User.blockUser('testuser23', process.env.u1Id);
        } catch (e) {
            console.log(e)
            expect(e).toBeInstanceOf(Error)
        }
    });
});



/************************************** unblockUser */

describe("unblockUser", function () {

    test("works", async function () {
        await db.query(`
                INSERT INTO blocked_users (user_id,blocked_user_id) values
                (${+process.env.u1Id},${+process.env.u2Id})`)

        let unblock = await User.unblockUser('testuser2', process.env.u1Id);
        const result = await db.query(`
        SELECT * from blocked_users
        `)
        expect(result.rows.length).toEqual(0);
    });

    test("error if id  not found", async function () {
        try {
            let block = await User.unblockUser('testuser2', 23);
        } catch (e) {
            console.log(e)
            expect(e).toBeInstanceOf(Error)
        }
    });

    test("error if username not found", async function () {
        try {
            let block = await User.unblockUser('testuser23', process.env.u1Id);
        } catch (e) {
            console.log(e)
            expect(e).toBeInstanceOf(Error)
        }
    });
});
