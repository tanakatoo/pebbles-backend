
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
const Studybuddy = require("./studybuddyModel.js");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** getList */

describe("getList", function () {

    test("works", async function () {
        //change test user so that it has data and is a study buddy

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
            study_buddy_active=true
            where id = ${process.env.u1Id}
        `)

        const updateStudyBuddyTypes = await db.query(
            `INSERT INTO study_buddy_types_users (study_buddy_type_id,user_id) values (1,${process.env.u1Id}),(2,${process.env.u1Id})`
        )

        let list = await Studybuddy.getList(1);

        expect(list.length).toEqual(1);
        expect(list[0].learning_language).toEqual('Japanese');
        expect(list[0].study_buddy_types).toEqual(['StudyBuddy', 'LanguageExchange'])

    });


    test("displays only max per page - change to 1 for test otherwise this will fail", async function () {
        //change test user so that it has data and is a study buddy

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
            study_buddy_active=true 
            where id = ${process.env.u1Id}
        `)

        const updateStudyBuddyTypes = await db.query(
            `INSERT INTO study_buddy_types_users (study_buddy_type_id,user_id) values (1,${process.env.u1Id}),(2,${process.env.u1Id})`
        )

        const updated2 = await db.query(`UPDATE users SET 
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
        study_buddy_active=true 
        where id = ${process.env.u2Id}
    `)

        const updateStudyBuddyTypes2 = await db.query(
            `INSERT INTO study_buddy_types_users (study_buddy_type_id,user_id) values (1,${process.env.u2Id}),(2,${process.env.u2Id})`
        )

        let list = await Studybuddy.getList(1);

        expect(list.length).toEqual(1);
        expect(list[0].learning_language).toEqual('Japanese');

    });

    test("displays latest activated first", async function () {
        //change test user so that it has data and is a study buddy

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
            study_buddy_activate_date = '2023-01-01'
            where id = ${process.env.u1Id}
        `)

        const updateStudyBuddyTypes = await db.query(
            `INSERT INTO study_buddy_types_users (study_buddy_type_id,user_id) values (1,${process.env.u1Id}),(2,${process.env.u1Id})`
        )

        const updated2 = await db.query(`UPDATE users SET 
        name='Display me first', 
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
        study_buddy_activate_date = '2023-02-01'
        where id = ${process.env.u2Id}
    `)

        const updateStudyBuddyTypes2 = await db.query(
            `INSERT INTO study_buddy_types_users (study_buddy_type_id,user_id) values (1,${process.env.u2Id}),(2,${process.env.u2Id})`
        )

        let list = await Studybuddy.getList(1);
        expect(list.length).toEqual(2);
        expect(list[0].name).toEqual('Display me first');

    });

    test("error if no page passed in", async function () {
        try {
            let list = await Studybuddy.getList();

        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });

});



/************************************** searchList */

describe("searchList", function () {

    test("works for word filter", async function () {
        //change test user so that it has data and is a study buddy

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
            study_buddy_active=true
            where id = ${process.env.u1Id}
        `)

        const updateStudyBuddyTypes = await db.query(
            `INSERT INTO study_buddy_types_users (study_buddy_type_id,user_id) values (1,${process.env.u1Id}),(2,${process.env.u1Id})`
        )

        let list = await Studybuddy.searchList(1, 'Me', [], [], [], [], [], [], []);

        expect(list.length).toEqual(1);
        expect(list[0].learning_language).toEqual('Japanese');
        expect(list[0].study_buddy_types).toEqual(['StudyBuddy', 'LanguageExchange'])

    });

    test("works for native language filter", async function () {
        //change test user so that it has data and is a study buddy

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
            study_buddy_active=true
            where id = ${process.env.u1Id}
        `)

        const updateStudyBuddyTypes = await db.query(
            `INSERT INTO study_buddy_types_users (study_buddy_type_id,user_id) values (1,${process.env.u1Id}),(2,${process.env.u1Id})`
        )

        let list = await Studybuddy.searchList(1, '', [], [], [], [], [], ['Japanese', 'English'], []);

        expect(list.length).toEqual(1);
        expect(list[0].learning_language).toEqual('Japanese');
        expect(list[0].study_buddy_types).toEqual(['StudyBuddy', 'LanguageExchange'])

    });

    test("works for learning language filter", async function () {
        //change test user so that it has data and is a study buddy

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
            study_buddy_active=true
            where id = ${process.env.u1Id}
        `)

        const updateStudyBuddyTypes = await db.query(
            `INSERT INTO study_buddy_types_users (study_buddy_type_id,user_id) values (1,${process.env.u1Id}),(2,${process.env.u1Id})`
        )

        let list = await Studybuddy.searchList(1, '', [], [], [], [], [], [], ['Japanese']);

        expect(list.length).toEqual(1);
        expect(list[0].learning_language).toEqual('Japanese');
        expect(list[0].study_buddy_types).toEqual(['StudyBuddy', 'LanguageExchange'])

    });

    test("works for gender filter", async function () {
        //change test user so that it has data and is a study buddy

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
            study_buddy_active=true
            where id = ${process.env.u1Id}
        `)

        const updateStudyBuddyTypes = await db.query(
            `INSERT INTO study_buddy_types_users (study_buddy_type_id,user_id) values (1,${process.env.u1Id}),(2,${process.env.u1Id})`
        )

        let list = await Studybuddy.searchList(1, '', [], ['male', 'other'], [], [], [], [], []);

        expect(list.length).toEqual(1);
        expect(list[0].learning_language).toEqual('Japanese');
        expect(list[0].study_buddy_types).toEqual(['StudyBuddy', 'LanguageExchange'])

    });

    test("works for language level filter", async function () {
        //change test user so that it has data and is a study buddy

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
            study_buddy_active=true
            where id = ${process.env.u1Id}
        `)

        const updateStudyBuddyTypes = await db.query(
            `INSERT INTO study_buddy_types_users (study_buddy_type_id,user_id) values (1,${process.env.u1Id}),(2,${process.env.u1Id})`
        )

        let list = await Studybuddy.searchList(1, '', ['Beginner', 'Advanced'], [], [], [], [], [], []);

        expect(list.length).toEqual(1);
        expect(list[0].learning_language).toEqual('Japanese');
        expect(list[0].study_buddy_types).toEqual(['StudyBuddy', 'LanguageExchange'])

    });

    test("works for age filter", async function () {
        //change test user so that it has data and is a study buddy

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
            study_buddy_active=true
            where id = ${process.env.u1Id}
        `)

        const updateStudyBuddyTypes = await db.query(
            `INSERT INTO study_buddy_types_users (study_buddy_type_id,user_id) values (1,${process.env.u1Id}),(2,${process.env.u1Id})`
        )

        let list = await Studybuddy.searchList(1, '', [], [], [], ['18-25'], [], [], []);

        expect(list.length).toEqual(1);
        expect(list[0].learning_language).toEqual('Japanese');
        expect(list[0].study_buddy_types).toEqual(['StudyBuddy', 'LanguageExchange'])

    });

    test("works for timezone filter", async function () {
        //change test user so that it has data and is a study buddy

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
            study_buddy_active=true
            where id = ${process.env.u1Id}
        `)

        const updateStudyBuddyTypes = await db.query(
            `INSERT INTO study_buddy_types_users (study_buddy_type_id,user_id) values (1,${process.env.u1Id}),(2,${process.env.u1Id})`
        )

        let list = await Studybuddy.searchList(1, '', [], [], ['LosAngeles', 'HongKong'], [], [], [], []);

        expect(list.length).toEqual(1);
        expect(list[0].learning_language).toEqual('Japanese');
        expect(list[0].study_buddy_types).toEqual(['StudyBuddy', 'LanguageExchange'])

    });


    test("works for study buddy type filter", async function () {
        //change test user so that it has data and is a study buddy

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
            study_buddy_active=true
            where id = ${process.env.u1Id}
        `)

        const updateStudyBuddyTypes = await db.query(
            `INSERT INTO study_buddy_types_users (study_buddy_type_id,user_id) values (1,${process.env.u1Id}),(2,${process.env.u1Id})`
        )

        let list = await Studybuddy.searchList(1, '', [], [], [], [], ['StudyBuddy'], [], []);

        expect(list.length).toEqual(1);
        expect(list[0].learning_language).toEqual('Japanese');
        expect(list[0].study_buddy_types).toEqual(['StudyBuddy', 'LanguageExchange'])

    });

    test("fails if one criteria does not fit", async function () {
        //change test user so that it has data and is a study buddy

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
            study_buddy_active=true
            where id = ${process.env.u1Id}
        `)

        const updateStudyBuddyTypes = await db.query(
            `INSERT INTO study_buddy_types_users (study_buddy_type_id,user_id) values (1,${process.env.u1Id}),(2,${process.env.u1Id})`
        )

        let list = await Studybuddy.searchList(1, '', [], [], [], [], ['StudyBuddy'], [], ['English']);

        expect(list.length).toEqual(0);


    });

    test("displays only max per page - change to 1 for test otherwise this will fail", async function () {
        //change test user so that it has data and is a study buddy

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
            study_buddy_active=true 
            where id = ${process.env.u1Id}
        `)

        const updateStudyBuddyTypes = await db.query(
            `INSERT INTO study_buddy_types_users (study_buddy_type_id,user_id) values (1,${process.env.u1Id}),(2,${process.env.u1Id})`
        )

        const updated2 = await db.query(`UPDATE users SET 
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
        study_buddy_active=true 
        where id = ${process.env.u2Id}
    `)

        const updateStudyBuddyTypes2 = await db.query(
            `INSERT INTO study_buddy_types_users (study_buddy_type_id,user_id) values (1,${process.env.u2Id}),(2,${process.env.u2Id})`
        )

        let list = await Studybuddy.searchList(1, '', [], [], [], [], ['StudyBuddy'], [], []);


        expect(list.length).toEqual(1);
        expect(list[0].learning_language).toEqual('Japanese');

    });

    test("displays users that only fit the criteria", async function () {
        //change test user so that it has data and is a study buddy

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
            study_buddy_active=true 
            where id = ${process.env.u1Id}
        `)

        const updateStudyBuddyTypes = await db.query(
            `INSERT INTO study_buddy_types_users (study_buddy_type_id,user_id) values (1,${process.env.u1Id})`
        )

        const updated2 = await db.query(`UPDATE users SET 
        name='Testing Me2', 
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
        gender_id=2,
        study_buddy_active=true 
        where id = ${process.env.u2Id}
    `)

        const updateStudyBuddyTypes2 = await db.query(
            `INSERT INTO study_buddy_types_users (study_buddy_type_id,user_id) values (1,${process.env.u2Id}),(2,${process.env.u2Id})`
        )

        let list = await Studybuddy.searchList(1, '', [], [], [], [], ['LanguageExchange'], [], []);


        expect(list.length).toEqual(1);
        expect(list[0].gender).toEqual('female');

    });

    test("fails if expecting array but string is passed", async function () {
        //change test user so that it has data and is a study buddy

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
            study_buddy_active=true 
            where id = ${process.env.u1Id}
        `)

        const updateStudyBuddyTypes = await db.query(
            `INSERT INTO study_buddy_types_users (study_buddy_type_id,user_id) values (1,${process.env.u1Id})`
        )

        const updated2 = await db.query(`UPDATE users SET 
        name='Testing Me2', 
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
        gender_id=2,
        study_buddy_active=true 
        where id = ${process.env.u2Id}
    `)

        const updateStudyBuddyTypes2 = await db.query(
            `INSERT INTO study_buddy_types_users (study_buddy_type_id,user_id) values (1,${process.env.u2Id}),(2,${process.env.u2Id})`
        )
        try {
            let list = await Studybuddy.searchList(1, '', [], [], [], [], 'LanguageExchange', [], []);
        } catch (e) {
            expect(e instanceof NotFoundError).toBeTruthy();
        }

    });


});
