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

/************************************** DELETE /users/unblock/:username/ */

// describe("DELETE /users/unblock/:username/", function () {
//     test("successfully unblocks a user", async function () {

//         await db.query(`
//         INSERT INTO blocked_users (user_id,blocked_user_id) values
//         (${+process.env.u1Id},${+process.env.u2Id})`)

//         const resp = await request(app)
//             .delete(`/users/unblock/testuser2`)
//             .set("authorization", `Bearer ${process.env.u1Token}`);

//         expect(resp.status).toEqual(204);
//     });

//     test("cannot unblock a user when logged out", async function () {

//         await db.query(`
//         INSERT INTO blocked_users (user_id,blocked_user_id) values
//         (${+process.env.u1Id},${+process.env.u2Id})`)

//         const resp = await request(app)
//             .delete(`/users/unblock/testuser2`)

//         expect(resp.body.error.message).toEqual("UNAUTHORIZED");
//     });

//     test("cannot unblock user not in system", async function () {

//         await db.query(`
//         INSERT INTO blocked_users (user_id,blocked_user_id) values
//         (${+process.env.u1Id},${+process.env.u2Id})`)

//         const resp = await request(app)
//             .delete(`/users/unblock/notInSystem`)
//             .set("authorization", `Bearer ${process.env.u1Token}`);

//         expect(resp.body.error.message).toEqual("NOT_FOUND");
//     });

// });



// /************************************** POST /users/block/:username/ */

// describe("POST /users/block/:username/", function () {
//     test("successfully blocks a user", async function () {

//         const resp = await request(app)
//             .post(`/users/block/testuser2`)
//             .set("authorization", `Bearer ${process.env.u1Token}`);

//         expect(resp.status).toEqual(201);
//     });

//     test("cannot block a user when logged out", async function () {

//         const resp = await request(app)
//             .post(`/users/block/testuser2`)

//         expect(resp.body.error.message).toEqual("UNAUTHORIZED");
//     });

//     test("cannot block user not in system", async function () {

//         const resp = await request(app)
//             .post(`/users/block/notInSystem`)
//             .set("authorization", `Bearer ${process.env.u1Token}`);

//         expect(resp.body.error.message).toEqual("NOT_FOUND");
//     });

// });



// /************************************** GET /users/blocked */

// describe("GET /users/blocked", function () {
//     test("successfully gets list of blocked users", async function () {

//         await db.query(`
//         INSERT INTO blocked_users (user_id,blocked_user_id) values
//         (${+process.env.u1Id},${+process.env.u2Id})`)

//         const resp = await request(app)
//             .get(`/users/blocked`)
//             .set("authorization", `Bearer ${process.env.u1Token}`);

//         expect(resp.body.length).toEqual(1);
//     });

//     test("cannot get blocked users when logged out", async function () {

//         await db.query(`
//         INSERT INTO blocked_users (user_id,blocked_user_id) values
//         (${+process.env.u1Id},${+process.env.u2Id})`)

//         const resp = await request(app)
//             .get(`/users/blocked`)

//         expect(resp.body.error.message).toEqual("UNAUTHORIZED");
//     });
// });



// /************************************** GET /contacts */

// describe("GET /contacts", function () {
//     test("successfully gets list of users logged in user is contacting", async function () {
//         //insert some messages 
//         await db.query(
//             `INSERT INTO messages (from_user_id,to_user_id,msg)
//     VALUES(${process.env.u1Id},${process.env.u2Id},'from 1 to 2'),
//     (${process.env.u3Id},${process.env.u1Id},'from 3 to 1')
//     `
//         )

//         const resp = await request(app)
//             .get(`/users/contacts`)
//             .set("authorization", `Bearer ${process.env.u1Token}`);

//         expect(resp.body.length).toEqual(2);
//     });

//     test("does not get users that logged in user did not contact before ", async function () {
//         //insert some messages 
//         await db.query(
//             `INSERT INTO messages (from_user_id,to_user_id,msg)
//     VALUES(${process.env.u1Id},${process.env.u2Id},'from 1 to 2')
//     `
//         )

//         const resp = await request(app)
//             .get(`/users/contacts`)
//             .set("authorization", `Bearer ${process.env.u1Token}`);
//         console.log(resp.body)
//         expect(resp.body.length).toEqual(1);
//         expect(resp.body[0].username).not.toEqual("testuser3");
//     });

//     test("cannot get contacts when logged out", async function () {
//         //insert some messages 
//         await db.query(
//             `INSERT INTO messages (from_user_id,to_user_id,msg)
//             VALUES(${process.env.u1Id},${process.env.u2Id},'from 1 to 2'),
//             (${process.env.u3Id},${process.env.u1Id},'from 3 to 1')
// `
//         )
//         const resp = await request(app)
//             .get(`/users/contacts`)

//         expect(resp.body.error.message).toEqual("UNAUTHORIZED");
//     });
// });



// /************************************** post /save/:username */

// describe("POST /save/:username", function () {
//     test("successfully saves a user", async function () {

//         const resp = await request(app)
//             .post(`/users/save/testuser2`)
//             .set("authorization", `Bearer ${process.env.u1Token}`);
//         console.log('saving user', resp.body)
//         expect(resp.status).toEqual(201);
//     });

//     test("does not save user if not logged in ", async function () {

//         const resp = await request(app)
//             .post(`/users/save/testuser2`)


//         expect(resp.body.error.message).toEqual("UNAUTHORIZED");
//     });

//     test("cannot save user not in system", async function () {

//         const resp = await request(app)
//             .post(`/users/save/notAUser`)
//             .set("authorization", `Bearer ${process.env.u1Token}`);

//         expect(resp.body.error.message).toEqual("NOT_FOUND");
//     });
// });




// /************************************** delete /unsave/:username */

// describe("DELETE /unsave/:username", function () {
//     test("successfully unsaves a user", async function () {

//         await db.query(
//             `INSERT INTO saved (user_id,saved_id,type)
//             VALUES(${process.env.u1Id}, ${process.env.u2Id}, 'user')`
//         )

//         const resp = await request(app)
//             .delete(`/users/unsave/testuser2`)
//             .set("authorization", `Bearer ${process.env.u1Token}`);
//         console.log('unsaving user', resp.body)
//         expect(resp.status).toEqual(204);
//     });

//     test("does not throw error when user unsaves a user they did not save", async function () {

//         const resp = await request(app)
//             .delete(`/users/unsave/testuser2`)
//             .set("authorization", `Bearer ${process.env.u1Token}`);
//         console.log('unsaving user', resp.body)
//         expect(resp.status).toEqual(204);
//     });

//     test("does not unsave user if not logged in ", async function () {

//         const resp = await request(app)
//             .delete(`/users/unsave/testuser2`)


//         expect(resp.body.error.message).toEqual("UNAUTHORIZED");
//     });

//     test("cannot unsave user not in system", async function () {

//         const resp = await request(app)
//             .delete(`/users/unsave/notAUser`)
//             .set("authorization", `Bearer ${process.env.u1Token}`);

//         expect(resp.body.error.message).toEqual("NOT_FOUND");
//     });
// });





// /************************************** get /saved-users */

// describe("GET /saved-users", function () {
//     test("successfully get list of saved users", async function () {

//         await db.query(
//             `INSERT INTO saved (user_id,saved_id,type)
//             VALUES (${process.env.u1Id}, ${process.env.u2Id}, 'user'),
//             (${process.env.u1Id}, ${process.env.u3Id}, 'user')`
//         )

//         const resp = await request(app)
//             .get(`/users/saved-users`)
//             .set("authorization", `Bearer ${process.env.u1Token}`);

//         expect(resp.body.length).toEqual(2);
//     });

//     test("does not get user they did not save", async function () {
//         await db.query(
//             `INSERT INTO saved(user_id, saved_id, type)
//             VALUES(${process.env.u1Id}, ${process.env.u2Id}, 'user')`
//         )

//         const resp = await request(app)
//             .get(`/users/saved-users`)
//             .set("authorization", `Bearer ${process.env.u1Token}`);

//         expect(resp.body.length).toEqual(1);
//         expect(resp.body[0].username).toEqual('testuser2')
//     });

//     test("does not get list of saved users if not logged in ", async function () {

//         const resp = await request(app)
//             .get(`/users/saved-users`)

//         expect(resp.body.error.message).toEqual("UNAUTHORIZED");
//     });

// });




/************************************** patch /users/:username */

describe("PATCH /users/:username", function () {
    test("successfully updates all information in profile", async function () {

        const updated = await db.query(`UPDATE users SET 
        name='Testing Me', 
        country_id=${process.env.countryId},
        state_id=${process.env.stateId},
        city_id=${process.env.cityId},
        about='This is test user 1',
        study_buddy_purpose='This is purpose',
        study_buddy_bio='This is the bio',
        study_buddy_native_language_id=1,
        study_buddy_learning_language_id=2,
        study_buddy_language_level_id=1,
        study_buddy_timezone_id=1,
        study_buddy_age_range_id=1,
        gender_id=1,
        study_buddy_active=true,
        study_buddy_activate_date='2023-01-01'
        where id = ${process.env.u1Id}
    `)

        // const updateStudyBuddyTypes = await db.query(
        //     `INSERT INTO study_buddy_types_users (study_buddy_type_id,user_id) values (1,${process.env.u1Id}),(2,${process.env.u1Id})`
        // )


        const resp = await request(app)
            .patch(`/users/testuser1`)
            .send({
                name: 'Testing Me',
                country_en: 'Canada',
                country_ja: 'カナダ',
                state_en: "Ontario",
                state_ja: "オンタリオ",
                city_ja: "ウォータールー",
                city_en: "Waterloo",
                gender: "male",
                time_zone: "Moscow",
                age_range: "26-35",
                about: 'This is test user 1',
                motivational_level: "Very",
                study_time: "everyday",
                myway_language_level: "Intermediate",
                language_level: "Beginner",
                native_language: "Japanese",
                learning_language: "English",
                study_buddy_purpose: 'This is purpose',
                about: 'This is all about me',
                myway_habits: 'No habit really!',
                myway_advice: "This is the advice I would give",
                study_buddy_bio: "This is study buddy bio",
                study_buddy_purpose: "This is the purpose",
                study_buddy_active: true,
                goals: ['Vocabulary', 'Pronunciation'],
                study_buddy_types: ['StudyBuddy', 'LanguageExchange']
            })
            .set("authorization", `Bearer ${process.env.u1Token}`);

        console.log(resp.body)
        expect(resp.body.name).toEqual('Testing Me');
        expect(resp.body.country_en).toEqual('Canada');
        expect(resp.body.country_ja).toEqual('カナダ');
        expect(resp.body.state_en).toEqual('Ontario');
        expect(resp.body.state_ja).toEqual('オンタリオ');
        expect(resp.body.city_ja).toEqual('ウォータールー');
        expect(resp.body.city_en).toEqual('Waterloo');
        expect(resp.body.gender).toEqual('male');
        expect(resp.body.time_zone).toEqual('Moscow');
        expect(resp.body.age_range).toEqual('26-35');
        expect(resp.body.about).toEqual('This is test user 1');
        expect(resp.body.motivational_level).toEqual('Very');
        expect(resp.body.study_time).toEqual('everyday');
        expect(resp.body.myway_language_level).toEqual('Intermediate');
        expect(resp.body.language_level).toEqual('Beginner');
        expect(resp.body.native_language).toEqual('Japanese');
        expect(resp.body.learning_language).toEqual('English');
        expect(resp.body.study_buddy_purpose).toEqual('This is purpose');
        expect(resp.body.about).toEqual('This is all about me');
        expect(resp.body.myway_habits).toEqual('No habit really!');
        expect(resp.body.myway_advice).toEqual('This is the advice I would give');
        expect(resp.body.study_buddy_bio).toEqual('This is study buddy bio');
        expect(resp.body.study_buddy_purpose).toEqual('This is the purpose');
        expect(resp.body.study_buddy_active).toEqual(true);
        expect(resp.body.study_buddy_activate_date).toEqual(expect.any(Date));
        expect(resp.body.goals).toEqual(['Vocabulary', 'Pronunciation']);
        expect(resp.body.study_buddy_types).toEqual(['StudyBuddy', 'LanguageExchange']);
        expect(resp.body.).toEqual('');
        expect(resp.body.).toEqual('');
        expect(resp.body.).toEqual('');
        expect(resp.body.).toEqual('');
        expect(resp.body.).toEqual('');
        expect(resp.body.).toEqual('');
    });

    // test("does not get user they did not save", async function () {
    //     await db.query(
    //         `INSERT INTO saved(user_id, saved_id, type)
    //         VALUES(${process.env.u1Id}, ${process.env.u2Id}, 'user')`
    //     )

    //     const resp = await request(app)
    //         .get(`/users/saved-users`)
    //         .set("authorization", `Bearer ${process.env.u1Token}`);

    //     expect(resp.body.length).toEqual(1);
    //     expect(resp.body[0].username).toEqual('testuser2')
    // });

    // test("does not get list of saved users if not logged in ", async function () {

    //     const resp = await request(app)
    //         .get(`/users/saved-users`)

    //     expect(resp.body.error.message).toEqual("UNAUTHORIZED");
    // });

});
