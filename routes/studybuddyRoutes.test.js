"use strict";

const request = require("supertest");
const db = require('../db')
const app = require("../app");

const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    getTokens,
    setLocation
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** GET /study-buddies/search */

// describe("GET /study-buddies/search", function () {
//     test("works with multiple search criteria", async function () {
//         //change test user so that it has data and is a study buddy
//         // await setLocation()
//         const updated = await db.query(`UPDATE users SET 
//             name='Testing Me', 
//             country_id=${process.env.countryId},
//             state_id=${process.env.stateId},
//             city_id=${process.env.cityId},
//             about='This is test user 1',
//             study_buddy_purpose='This is purpose',
//             study_buddy_bio='This is the bio',
//             study_buddy_native_language_id=1,
//             study_buddy_learning_language_id=2,
//             study_buddy_language_level_id=1,
//             study_buddy_timezone_id=1,
//             study_buddy_age_range_id=1,
//             gender_id=1,
//             study_buddy_active=true 
//             where id = ${process.env.u1Id}
//         `)

//         const updateStudyBuddyTypes = await db.query(
//             `INSERT INTO study_buddy_types_users (study_buddy_type_id,user_id) values (1,${process.env.u1Id}),(2,${process.env.u1Id})`
//         )

//         const resp2 = await request(app)
//             .get("/study-buddies/search")
//             .query({
//                 page: 1,
//                 word: 'the bio',
//                 'language_level[]': ['Beginner'],
//                 'gender[]': ['male'],
//                 'timezone[]': ['LosAngeles'],
//                 'age[]': ['18-25'],
//                 'type[]': ['StudyBuddy'],
//                 'native_lang[]': ['English'],
//                 'learning_lang[]': ['Japanese']
//             });
//         expect(resp2.body.length).toEqual(1);
//     });

//     test("works with more than one criteria in each filter", async function () {
//         //change test user so that it has data and is a study buddy
//         // await setLocation()
//         const updated = await db.query(`UPDATE users SET 
//             name='Testing Me', 
//             country_id=${process.env.countryId},
//             state_id=${process.env.stateId},
//             city_id=${process.env.cityId},
//             about='This is test user 1',
//             study_buddy_purpose='This is purpose',
//             study_buddy_bio='This is the bio',
//             study_buddy_native_language_id=1,
//             study_buddy_learning_language_id=2,
//             study_buddy_language_level_id=1,
//             study_buddy_timezone_id=1,
//             study_buddy_age_range_id=1,
//             gender_id=1,
//             study_buddy_active=true 
//             where id = ${process.env.u1Id}
//         `)

//         const updateStudyBuddyTypes = await db.query(
//             `INSERT INTO study_buddy_types_users (study_buddy_type_id,user_id) values (1,${process.env.u1Id}),(2,${process.env.u1Id})`
//         )


//         const resp2 = await request(app)
//             .get("/study-buddies/search")
//             .query({
//                 page: 1,
//                 word: 'purpose',
//                 'language_level[]': ['Beginner', 'Intermediate'],
//                 'gender[]': ['male', 'female'],
//                 'timezone[]': ['LosAngeles', 'Toronto'],
//                 'age[]': ['18-25', '26-35'],
//                 'type[]': ['StudyBuddy', 'LanguageExchange'],
//                 'native_lang[]': ['English', 'Japanese'],
//                 'learning_lang[]': ['Japanese', 'English']
//             });
//         expect(resp2.body.length).toEqual(1);
//     });


//     test("return no results if criteria not correct", async function () {
//         //change test user so that it has data and is a study buddy
//         // await setLocation()
//         const updated = await db.query(`UPDATE users SET 
//             name='Testing Me', 
//             country_id=${process.env.countryId},
//             state_id=${process.env.stateId},
//             city_id=${process.env.cityId},
//             about='This is test user 1',
//             study_buddy_purpose='This is purpose',
//             study_buddy_bio='This is the bio',
//             study_buddy_native_language_id=1,
//             study_buddy_learning_language_id=2,
//             study_buddy_language_level_id=1,
//             study_buddy_timezone_id=1,
//             study_buddy_age_range_id=1,
//             gender_id=1,
//             study_buddy_active=true 
//             where id = ${process.env.u1Id}
//         `)

//         const updateStudyBuddyTypes = await db.query(
//             `INSERT INTO study_buddy_types_users (study_buddy_type_id,user_id) values (1,${process.env.u1Id}),(2,${process.env.u1Id})`
//         )


//         const resp2 = await request(app)
//             .get("/study-buddies/search")
//             .query({
//                 page: 1,
//                 word: '',
//                 'language_level[]': [],
//                 'gender[]': [],
//                 'timezone[]': [],
//                 'age[]': [],
//                 'type[]': ['Volunteer'],
//                 'native_lang[]': [],
//                 'learning_lang[]': []
//             });
//         expect(resp2.body.length).toEqual(0);
//     });


// });

/************************************** GET /study-buddies/page */

describe("GET /study-buddies/page", function () {
    // test("returns latest study buddies in order of activate date", async function () {
    //     //change test user so that it has data and is a study buddy
    //     // await setLocation()
    //     const updated = await db.query(`UPDATE users SET 
    //         name='Testing Me', 
    //         country_id=${process.env.countryId},
    //         state_id=${process.env.stateId},
    //         city_id=${process.env.cityId},
    //         about='This is test user 1',
    //         study_buddy_purpose='This is purpose',
    //         study_buddy_bio='This is the bio',
    //         study_buddy_native_language_id=1,
    //         study_buddy_learning_language_id=2,
    //         study_buddy_language_level_id=1,
    //         study_buddy_timezone_id=1,
    //         study_buddy_age_range_id=1,
    //         gender_id=1,
    //         study_buddy_active=true,
    //         study_buddy_activate_date='2023-01-01'
    //         where id = ${process.env.u1Id}
    //     `)

    //     const updateStudyBuddyTypes = await db.query(
    //         `INSERT INTO study_buddy_types_users (study_buddy_type_id,user_id) values (1,${process.env.u1Id}),(2,${process.env.u1Id})`
    //     )

    //     const updated2 = await db.query(`UPDATE users SET 
    //         name='Testing You', 
    //         country_id=${process.env.countryId},
    //         state_id=${process.env.stateId},
    //         city_id=${process.env.cityId},
    //         about='This is test user 2',
    //         study_buddy_purpose='This is purpose',
    //         study_buddy_bio='This is the bio',
    //         study_buddy_native_language_id=1,
    //         study_buddy_learning_language_id=2,
    //         study_buddy_language_level_id=1,
    //         study_buddy_timezone_id=1,
    //         study_buddy_age_range_id=1,
    //         gender_id=1,
    //         study_buddy_active=true,
    //         study_buddy_activate_date='2023-01-02'
    //         where id = ${process.env.u2Id}
    //     `)

    //     const updateStudyBuddyTypes2 = await db.query(
    //         `INSERT INTO study_buddy_types_users (study_buddy_type_id,user_id) values (1,${process.env.u2Id}),(2,${process.env.u2Id})`
    //     )

    //     const resp2 = await request(app)
    //         .get("/study-buddies/1");

    //     expect(resp2.body[0].username).toEqual("testuser2");
    // });

    test("hits not found route if no page in route", async function () {
        //change test user so that it has data and is a study buddy
        // await setLocation()
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

        const updateStudyBuddyTypes = await db.query(
            `INSERT INTO study_buddy_types_users (study_buddy_type_id,user_id) values (1,${process.env.u1Id}),(2,${process.env.u1Id})`
        )

        const updated2 = await db.query(`UPDATE users SET 
            name='Testing You', 
            country_id=${process.env.countryId},
            state_id=${process.env.stateId},
            city_id=${process.env.cityId},
            about='This is test user 2',
            study_buddy_purpose='This is purpose',
            study_buddy_bio='This is the bio',
            study_buddy_native_language_id=1,
            study_buddy_learning_language_id=2,
            study_buddy_language_level_id=1,
            study_buddy_timezone_id=1,
            study_buddy_age_range_id=1,
            gender_id=1,
            study_buddy_active=true,
            study_buddy_activate_date='2023-01-02'
            where id = ${process.env.u2Id}
        `)

        const updateStudyBuddyTypes2 = await db.query(
            `INSERT INTO study_buddy_types_users (study_buddy_type_id,user_id) values (1,${process.env.u2Id}),(2,${process.env.u2Id})`
        )

        const resp2 = await request(app)
            .get("/study-buddies/");

        expect(resp2.body.error.message).toEqual('NOT_FOUND');
    });




});
