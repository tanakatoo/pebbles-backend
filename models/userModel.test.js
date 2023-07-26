
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

describe("getSearchUsers", function () {

    test("works", async function () {
        //change test user so that it has data and is a study buddy
        let list = await User.getSearchUsers('testuser1');

        expect(list.length).toEqual(1);

    });


    test("no results return if not found", async function () {
        //change test user so that it has data and is a study buddy
        let list = await User.getSearchUsers('testuser23');

        expect(list.length).toEqual(0);

    });

    test("searching in name", async function () {
        const updated = await db.query(`UPDATE users SET 
        name='Testing Me' where id=${process.env.u1Id}`)

        let list = await User.getSearchUsers('Me');

        expect(list.length).toEqual(1);

    });

    test("searching in about", async function () {
        const updated = await db.query(`UPDATE users SET 
        about='This is about me' where id=${process.env.u1Id}`)

        let list = await User.getSearchUsers('This is about me');

        expect(list.length).toEqual(1);

    });

    test("returns all results if no criteria", async function () {
        const updated = await db.query(`UPDATE users SET 
        about='This is about me' where id=${process.env.u1Id}`)

        let list = await User.getSearchUsers('');

        expect(list.length).toEqual(4);

    });

});

// /************************************** getUsersList */

describe("getUsersList", function () {

    test("works", async function () {
        //insert some messages 
        await db.query(
            `INSERT INTO messages (from_user_id,to_user_id,msg)
            VALUES(${process.env.u1Id},${process.env.u2Id},'from 1 to 2'),
            (${process.env.u3Id},${process.env.u1Id},'from 3 to 1')
            `
        )

        let messages = await User.getUsersList(process.env.u1Id);
        expect(messages.length).toEqual(2);
    });

    test("does not get users that logged in user did not contact before ", async function () {
        //insert some messages 
        await db.query(
            `INSERT INTO messages (from_user_id,to_user_id,msg)
            VALUES(${process.env.u1Id},${process.env.u2Id},'from 1 to 2'),
            (${process.env.u2Id},${process.env.u3Id},'from 2 to 3')
    `
        )
        let messages = await User.getUsersList(process.env.u1Id);
        expect(messages.length).toEqual(1);
        expect(messages[0].username).not.toEqual('testuser3');

    });

    test("does not get users that user has blocked ", async function () {
        //insert some messages 
        await db.query(
            `INSERT INTO messages (from_user_id,to_user_id,msg)
            VALUES(${process.env.u1Id},${process.env.u2Id},'from 1 to 2'),
            (${process.env.u1Id},${process.env.u3Id},'from 1 to 3')
    `
        )

        await db.query(`
        INSERT INTO blocked_users (user_id,blocked_user_id) values
        (${+process.env.u1Id},${+process.env.u2Id})`)

        let messages = await User.getUsersList(process.env.u1Id);
        expect(messages.length).toEqual(1);
        expect(messages[0].username).not.toEqual('testuser2');

    });

});


// /************************************** getRole */

describe("getRole", function () {

    test("works for regular", async function () {
        let role = await User.getRole(process.env.u1Id);
        expect(role.role).toEqual('regular');
    });
    test("works for admin", async function () {
        let role = await User.getRole(process.env.admin);
        expect(role.role).toEqual('admin');
    });
    test("error if id not found", async function () {
        try {
            let role = await User.getRole(23);
        } catch (e) {
            expect(e instanceof NotFoundError).toBeTruthy();
        }


    });
});


// /************************************** getBlockedUsers */

describe("getBlockedUsers", function () {

    test("works", async function () {
        await db.query(`
        INSERT INTO blocked_users (user_id,blocked_user_id) values
        (${+process.env.u1Id},${+process.env.u2Id}),
        (${+process.env.u2Id},${+process.env.u3Id})`)

        let list = await User.getBlockedUsers(process.env.u1Id);
        expect(list.length).toEqual(1);
    });

    test("error if id not found", async function () {
        try {
            let role = await User.getRole(23);
        } catch (e) {
            expect(e instanceof NotFoundError).toBeTruthy();
        }


    });
});


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



// /************************************** unblockUser */

describe("unblockUser", function () {

    test("works", async function () {
        await db.query(`
                INSERT INTO blocked_users (user_id,blocked_user_id) values
                (${+process.env.u1Id},${+process.env.u2Id})`)

        let unblock = await User.unblockUser(process.env.u1Id, 'testuser2');
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


// /************************************** register */

describe("register", function () {

    test("works", async function () {

        let newUser = await User.register({
            username: 'testuser4',
            password: 'asdfasdf',
            email: 'testuser4@test.com'
        });
        const result = await db.query(`
        SELECT * from users WHERE username='testuser4'
        `)
        expect(result.rows.length).toEqual(1);
    });

    test("error if username is already used", async function () {
        try {

            let newUser = await User.register({
                username: 'testuser1',
                password: 'asdfasdf',
                email: 'testuser4@test.com'
            });

        } catch (e) {
            console.log(e)
            expect(e instanceof BadRequestError).toBeTruthy();
        }
    });

    test("error if email is already used", async function () {
        try {

            let newUser = await User.register({
                username: 'testuser4',
                password: 'asdfasdf',
                email: 'testuser1@test.com'
            });

        } catch (e) {
            console.log(e)
            expect(e instanceof BadRequestError).toBeTruthy();
        }
    });
});


/************************************** register */

describe("login", function () {

    test("works for username and returns without password", async function () {

        let user = await User.login(
            'testuser1', '', 'asdfasdf'
        );

        expect(user.username).toEqual('testuser1');
        expect(user.password).toEqual(undefined);

    });

    test("works for email and returns without password", async function () {

        let user = await User.login(
            '', 'testuser1@test.com', 'asdfasdf'
        );

        expect(user.username).toEqual('testuser1');
        expect(user.password).toEqual(undefined);

    });


    test("error if email not found", async function () {
        try {
            let user = await User.login(
                '', 'testuser11@test.com', 'asdfasdf'
            );
        } catch (e) {
            expect(e).toBeInstanceOf(Error)
        }
    });

    test("error if username not found", async function () {
        try {
            let user = await User.login(
                'testuser11', '', 'asdfasdf'
            );
        } catch (e) {
            expect(e).toBeInstanceOf(Error)
        }
    });

});


/************************************** findUser */

describe("findUser", function () {

    test("works for username", async function () {

        let user = await User.findUser(
            'testuser1', ''
        );

        expect(user.username).toEqual('testuser1');
        expect(user.password).toEqual(undefined);

    });

    test("works for email", async function () {

        let user = await User.findUser(
            '', 'testuser1@test.com'
        );

        expect(user.username).toEqual('testuser1');
        expect(user.password).toEqual(undefined);

    });


    test("error if email not found", async function () {
        try {
            let user = await User.findUser(
                '', 'testuser11@test.com'
            );
        } catch (e) {
            expect(e).toBeInstanceOf(Error)
        }
    });

    test("error if username not found", async function () {
        try {
            let user = await User.findUser(
                'testuser11', '');
        } catch (e) {
            expect(e).toBeInstanceOf(Error)
        }
    });

});



// /************************************** saveUser */

describe("saveUser", function () {

    test("works", async function () {

        let user = await User.saveUser(
            process.env.u1Id, process.env.u2Id
        );

        expect(user).toEqual('success');


    });


    test("error if userid not found", async function () {
        try {
            let user = await User.saveUser(
                11, process.env.u2Id
            );

        } catch (e) {
            expect(e).toBeInstanceOf(Error)
        }
    });


    test("error if saveid not found", async function () {
        try {
            let user = await User.saveUser(
                process.env.u1Id, 11
            );

        } catch (e) {
            expect(e).toBeInstanceOf(Error)
        }
    });


});



// /************************************** unsaveUser */

describe("unsaveUser", function () {

    test("works", async function () {

        await db.query(
            `INSERT INTO saved (user_id,saved_id,type)
            VALUES(${process.env.u1Id},${process.env.u2Id},'user')`
        )

        let user = await User.unsaveUser(
            process.env.u1Id, process.env.u2Id
        );

        expect(user).toEqual('success');


    });


    test("no error if userid not found", async function () {

        let user = await User.unsaveUser(
            11, process.env.u2Id
        );
        expect(user).toEqual('success');


    });


    test(" no error if saveid not found", async function () {

        let user = await User.unsaveUser(
            process.env.u1Id, 11
        );

        expect(user).toEqual('success');


    });


});


/************************************** savedUsers */

describe("savedUsers", function () {

    test("works", async function () {
        await db.query(
            `INSERT INTO saved (user_id,saved_id,type)
            VALUES(${process.env.u1Id},${process.env.u2Id},'user')`
        )

        let user = await User.savedUsers(
            process.env.u1Id
        );

        expect(user.length).toEqual(1);


    });

    test("works for no results", async function () {

        let user = await User.savedUsers(
            process.env.u1Id
        );

        expect(user.length).toEqual(0);


    });



    test("error if userid not found", async function () {
        try {
            let user = await User.unsaveUser(
                11
            );

        } catch (e) {
            expect(e).toBeInstanceOf(Error)
        }
    });


});


// ************************************** update */

describe("update", function () {

    test("works", async function () {

        const data = {
            name: 'Testing Me',
            email: 'newtestuser1@test.com',
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
            myway_habits: 'No habit really!',
            myway_advice: "This is the advice I would give",
            study_buddy_bio: "This is study buddy bio",
            study_buddy_purpose: "This is the purpose",
            study_buddy_active: true,
            goals: ['Vocabulary', 'Pronunciation'],
            study_buddy_types: ['StudyBuddy', 'LanguageExchange']
        }

        let result = await User.update(process.env.u1Id, data)

        const respCountry = await db.query(
            `SELECT * from countries `
        )

        expect(respCountry.rows[0].name_en).toEqual('Canada');
        expect(respCountry.rows[0].name_ja).toEqual('カナダ');

        const respState = await db.query(
            `SELECT * from states `
        )

        expect(respState.rows[0].name_en).toEqual('Ontario');
        expect(respState.rows[0].name_ja).toEqual('オンタリオ');


        const respCity = await db.query(
            `SELECT * from cities `
        )

        expect(respCity.rows[0].name_en).toEqual('Waterloo');
        expect(respCity.rows[0].name_ja).toEqual('ウォータールー');
        expect(result).toEqual('done');

        const respUsers = await db.query(
            `SELECT * from users where id=${process.env.u1Id}`
        )

        expect(respUsers.rows[0].name).toEqual('Testing Me');
        expect(respUsers.rows[0].study_buddy_purpose).toEqual('This is the purpose');
        expect(respUsers.rows[0].myway_habits).toEqual('No habit really!');
        expect(respUsers.rows[0].myway_advice).toEqual('This is the advice I would give');
        expect(respUsers.rows[0].study_buddy_bio).toEqual('This is study buddy bio');
        expect(respUsers.rows[0].email).toEqual('newtestuser1@test.com');

        expect(result).toEqual('done');


        expect(respUsers.rows[0].gender_id).toEqual(1);
        expect(respUsers.rows[0].study_buddy_timezone_id).toEqual(10);
        expect(respUsers.rows[0].myway_language_level_id).toEqual(2);
        expect(respUsers.rows[0].myway_motivation_level_id).toEqual(1);
        expect(respUsers.rows[0].myway_study_time_id).toEqual(1);
        expect(respUsers.rows[0].study_buddy_native_language_id).toEqual(2);
        expect(respUsers.rows[0].study_buddy_learning_language_id).toEqual(1);
        expect(respUsers.rows[0].study_buddy_language_level_id).toEqual(1);
        expect(respUsers.rows[0].study_buddy_age_range_id).toEqual(2);
        expect(respUsers.rows[0].study_buddy_active).toEqual(true);



        const resptypes = await db.query(
            `SELECT * from study_buddy_types_users`
        )
        expect(resptypes.rows[0].study_buddy_type_id).toEqual(1);
        expect(resptypes.rows[1].study_buddy_type_id).toEqual(2);
        expect(resptypes.rows[0].user_id).toEqual(+process.env.u1Id);
        expect(resptypes.rows[1].user_id).toEqual(+process.env.u1Id);

        const respGoals = await db.query(
            `SELECT * from goals_users`
        )
        console.log(respGoals)
        expect(respGoals.rows[0].goal_id).toEqual(1);
        expect(respGoals.rows[1].goal_id).toEqual(2);
        expect(respGoals.rows[1].user_id).toEqual(+process.env.u1Id);
        expect(respGoals.rows[0].user_id).toEqual(+process.env.u1Id);

    });

    test("error if id is invalid", async function () {


        const data = {
            name: 'Testing Me',
            email: 'newtestuser1@test.com',
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
            myway_habits: 'No habit really!',
            myway_advice: "This is the advice I would give",
            study_buddy_bio: "This is study buddy bio",
            study_buddy_purpose: "This is the purpose",
            study_buddy_active: true,
            goals: ['Vocabulary', 'Pronunciation'],
            study_buddy_types: ['StudyBuddy', 'LanguageExchange']
        }
        try {
            let result = await User.update(11, data)
        }
        catch (e) {
            console.log(e)
            expect(e).toBeInstanceOf(Error)
        }


    });

    test("error if expected array is not an array", async function () {


        const data = {
            name: 'Testing Me',
            email: 'newtestuser1@test.com',
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
            myway_habits: 'No habit really!',
            myway_advice: "This is the advice I would give",
            study_buddy_bio: "This is study buddy bio",
            study_buddy_purpose: "This is the purpose",
            study_buddy_active: true,
            goals: 'Vocabulary',
            study_buddy_types: ['StudyBuddy', 'LanguageExchange']
        }
        try {
            let result = await User.update(process.env.u1Id, data)
        }
        catch (e) {
            console.log(e)
            expect(e).toBeInstanceOf(Error)
        }


    });

});


/************************************** getPrivate */

describe("getPrivate", function () {

    test("works", async function () {


        await db.query(
            `insert into study_buddy_types_users (user_id,study_buddy_type_id)
            values(${process.env.u1Id},1)`
        )

        let user = await User.getPrivate('testuser1');
        console.log(user)
        expect(user.email).toEqual('testuser1@test.com');
        expect(user.study_buddy_types).toEqual(['StudyBuddy']);
    });


    test("error if username not found", async function () {

        try {
            let user = await User.getPrivate(
                'usertest11'
            );
        } catch (e) {
            expect(e instanceof NotFoundError).toBeTruthy();
        }
    });
});


/************************************** getPublic */

describe("getPublic", function () {

    test("works", async function () {

        await db.query(
            `insert into study_buddy_types_users (user_id,study_buddy_type_id)
            values(${process.env.u1Id},1)`
        )

        let user = await User.getPublic('testuser1');
        console.log(user)
        expect(user.email).toEqual(undefined);
        expect(user.study_buddy_types).toEqual(['StudyBuddy']);

    });


    test("error if username not found", async function () {

        try {
            let user = await User.getPublic(
                'usertest11'
            );
        } catch (e) {
            expect(e instanceof NotFoundError).toBeTruthy();
        }
    });
});


/************************************** setPassword */

describe("setPassword", function () {

    test("works", async function () {

        let user = await User.setPassword(process.env.u1Id, 'newpassword');

        let logMeIn = await User.login('testuser1', "", 'newpassword')

        expect(user.id).toEqual(+process.env.u1Id);
        expect(logMeIn.username).toEqual('testuser1');
        expect(logMeIn.role).toEqual('regular');

    });


    test("error if id not found", async function () {

        try {
            let user = await User.setPassword(11, 'newpassword');
        } catch (e) {
            expect(e instanceof NotFoundError).toBeTruthy();
        }
    });
});
