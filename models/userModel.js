"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
const { BCRYPT_WORK_FACTOR } = require('../config')
const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
} = require("../error");
const { getUserID } = require('../helpers/getUserID')
const { baseQuery, privateBaseQuery } = require('../helpers/variables')
const { generateUpdateQuery,
    addTextValuesToQuery,
    updateManyToMany,
    insertCountryStateCity } = require('../helpers/generateUpdateQuery')
const { getManyToManyData } = require('../helpers/getManyToManyData')
class User {


    /** WORKS 
     * Get all users that the logged in user has messaged without the blocked users
     * (used for blocking additional users)
     * Returns [id] on success
     *
     **/

    static async getUsersList(id) {

        //get a list of users that the logged in user has messages for and filter out those that the user has blocked
        //this is so users can block more users
        const listOfUsers = await db.query(
            `SELECT DISTINCT 
                CASE
                    WHEN from_user_id = $1 THEN to_user_id
                    WHEN to_user_id = $1 THEN from_user_id
                END AS user_id
            FROM messages
            WHERE from_user_id = $1 OR to_user_id = $1`, [id]
        )

        console.log(listOfUsers.rows)
        return listOfUsers.rows;
    }

    /**WORKS 
     * Get user role every time we need to authorize them in case their role is changed in the backend
     * return user id, role
     */
    static async getRole(id) {
        const result = await db.query(
            `SELECT role
            FROM users
            WHERE id=$1`, [id]
        )
        console.log('in getting role, role is', result.rows[0])
        if (!result.rows[0]) {
            console.log('not found?')
            throw new NotFoundError
        }
        return result.rows[0]
    }

    /**WORKS  
     * Get all users that the user has blocked
     *
     * Returns [id] on success
     *
     **/

    static async getBlockedUsers(id) {

        //get a list of users that the logged in user has messages for and filter out those that the user has blocked
        //this is so users scan block more users
        const listOfBlockedUsers = await db.query(
            `SELECT blocked_user_id FROM blocked_users 
            WHERE user_id = $1`, [id])

        console.log(listOfBlockedUsers.rows)
        return listOfBlockedUsers.rows;
    }


    /**WORKS  
     * Block a user
     *
     * Returns id, username of blocked user on success
     *
     **/

    static async blockUser(username, id) {

        //get user id of the user to block
        const user_id = await getUserID(username)

        const result = await db.query(
            `INSERT INTO blocked_users (user_id,blocked_user_id) values($1,$2)`, [id, user_id])

        console.log(result.rows)
        return result.rows[0];
    }

    /**WORKS  
     * Unblock a user
         *
         * Returns [id] on success
         *
         **/

    static async unblockUser(id, username) {
        //get user id of the user to block
        const user_id = await getUserID(username)

        //get a list of users that the logged in user has blocked
        //this is so users can unblock users
        const unblockUser = await db.query(
            `DELETE FROM blocked_users WHERE user_id=$1 and blocked_user_id=$2`, [id, user_id]
        )

        console.log(unblockUser)
        return unblockUser;
    }

    /** Register user with username, email, password
     *
     * Returns { id, role } on success and BadRequestError on duplicates
     *
     **/

    static async register(
        { username, password, email }) {

        //check if email is already used
        const checkDuplicateEmail = await db.query(
            `SELECT email
           FROM users
           WHERE email = $1`,
            [email],
        );
        if (checkDuplicateEmail.rows[0]) {

            throw new BadRequestError("DUPLICATE_EMAIL");
        }
        //check if username is already used
        const checkDuplicateUsername = await db.query(
            `SELECT username
            FROM users
            WHERE username = $1`,
            [username],
        );
        if (checkDuplicateUsername.rows[0]) {

            throw new BadRequestError("USERNAME_TAKEN");
        }

        const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

        const result = await db.query(
            `INSERT INTO users
           (username,
            password,
            email)
           VALUES ($1, $2, $3)
           RETURNING id, username,role`,
            [
                username,
                hashedPassword,
                email
            ],
        );

        const user = result.rows[0];

        return user;
    }

    /** login user with username or email, password.
     *
     * Returns { id, username, first_name, last_name, email, is_admin }
     *
     * Throws UnauthorizedError is user not found or wrong password.
     **/

    static async login(username = null, email = null, password) {
        // try to find the user first
        const query = username ? 'username' : 'email'
        const queryData = username ? username : email
        const result = await db.query(
            `${privateBaseQuery}
               WHERE ${query} = $1`,
            [queryData],
        );
        console.log('got result', result.rows)
        const user = result.rows[0];

        if (user) {
            // compare hashed password to a new hash from password
            const isValid = await bcrypt.compare(password, user.password);
            if (isValid === true) {
                delete user.password;
                return user;
            }
        }

        throw new UnauthorizedError('INVALID_CREDENTIALS');
    }

    /**
     * See if a username or email exists for changing password
     * @returns user
     */

    static async findUser(username = null, email = null) {
        // try to find the user
        const query = username ? 'username' : 'email'
        const queryData = username ? username : email
        const result = await db.query(
            `SELECT username,email
               FROM users
               WHERE ${query} = $1`,
            [queryData],
        );

        const user = result.rows[0];
        return user;

    }


    /**
     * To favourite a user
     * @returns 201
     */
    static async saveUser(user_id, save_id) {
        const result = await db.query(
            `INSERT INTO saved_users (user_id,saved_id)
            VALUES ($1,$2)
            `, [user_id, save_id]
        )

        console.log(result)
        return "success";
    }


    /**
         * To unfavourite a user
         * @returns 204
         */
    static async unsaveUser(user_id, save_id) {
        const result = await db.query(
            `DELETE FROM saved_users
            WHERE user_id=$1 AND saved_id=$2
        `, [user_id, save_id]
        )

        //even if record doesn't exist, it is not an error
        return "success";
    }

    /**
        * Returns list of saved usernames for the logged in user
        * @returns 201
        */
    static async saved(id) {
        const result = await db.query(
            ` SELECT u.username
            FROM users u
            INNER JOIN saved_users su
            ON su.saved_id=u.id
            WHERE su.user_id==$1
        `, [id]
        )


        return result.rows;
    }

    /**works
        * updates data for the logged in user
        * @returns 201
        */
    static async update(id, data) {

        //we have to get the ids of the data we are saving to save to the user table
        //the data passed me must already be the "english" version of the data stored in the db for us to find the id
        //data can be an array
        //use Object.keys(object).find(key => object[key] === value); in the frontend
        //so we replace the info in the incoming data to IDs to be saved and then create a query from that
        let index = 2;
        let query = '';
        let values = [id];
        [query, values, index] = await generateUpdateQuery(data.gender, 'genders', 'gender_id', query, values, index);
        [query, values, index] = await generateUpdateQuery(data.timezone, 'timezones', 'study_buddy_timezone_id', query, values, index);
        [query, values, index] = await generateUpdateQuery(data.age, 'age_ranges', 'study_buddy_age_range_id', query, values, index);
        [query, values, index] = await generateUpdateQuery(data.motivation_level, 'motivation_levels', 'myway_motivation_level_id', query, values, index);
        [query, values, index] = await generateUpdateQuery(data.language_level, 'language_levels', 'study_buddy_language_level_id', query, values, index);
        [query, values, index] = await generateUpdateQuery(data.study_time, 'study_times', 'myway_study_time_id', query, values, index);
        [query, values, index] = await generateUpdateQuery(data.native_language, 'languages', 'study_buddy_native_language_id', query, values, index);
        [query, values, index] = await generateUpdateQuery(data.learning_language, 'languages', 'study_buddy_learning_language_id', query, values, index);

        //add other text into query
        [query, values, index] = addTextValuesToQuery(data.first_name, 'first_name', query, values, index);
        [query, values, index] = addTextValuesToQuery(data.last_name, 'last_name', query, values, index);
        [query, values, index] = addTextValuesToQuery(data.about, 'about', query, values, index);
        [query, values, index] = addTextValuesToQuery(data.myway_habits, 'myway_habits', query, values, index);
        [query, values, index] = addTextValuesToQuery(data.study_buddy_bio, 'study_buddy_bio', query, values, index);
        [query, values, index] = addTextValuesToQuery(data.study_buddy_active, 'study_buddy_active', query, values, index);

        if (data.study_buddy_active && data.study_buddy_active === true) {
            //also add activate date
            let date = new Date(Date.now());
            date = `${date.getUTCFullYear()}/${date.getUTCMonth() + 1}/${date.getUTCDate()}`;
            [query, values, index] = addTextValuesToQuery(date, 'study_buddy_activate_date', query, values, index);
        };


        //if city,country,state are in the data, we have to save that first
        //insert country, state city in that order, return the id to insert into next table
        //insert only if it doesn't exist
        //if we have an english version, we will have a japanese version

        //if no country specified, then set column to null
        let country_id = 0
        let state_id = 0
        let city_id = 0
        if (data.country_en && data.country_ja) {
            [query, values, index, country_id] = await insertCountryStateCity(data.country_en, data.country_ja, 'countries', 'country_id', null, null, query, values, index);
            if (data.state_en && data.state_ja) {
                [query, values, index, state_id] = await insertCountryStateCity(data.state_en, data.state_ja, 'states', 'state_id', country_id, 'country_id', query, values, index)
                if (data.city_en && data.city_ja) {
                    [query, values, index, city_id] = await insertCountryStateCity(data.city_en, data.city_ja, 'cities', 'city_id', state_id, 'state_id', query, values, index);
                } else {
                    query += `, city_id=$${index}`;
                    values.push(null)
                }
            }
            else {
                query += `, state_id=$${index}, city_id=$${index + 1}`;
                values.push(null)
                values.push(null)
            }
        } else {
            query += `, country_id= $${index}, state_id=$${index + 1}, city_id=$${index + 2}`;
            values.push(null)
            values.push(null)
            values.push(null)
        }

        console.log('query end', query)
        console.log('values end', values)

        /** test query
         * {"gender":"other","timezone":"HongKong", "age":"26-35","motivation_level":"Very", "study_time":"everyday","native_language":"English","learning_language":"Japanese","study_buddy_types":["StudyBuddy","LanguageExchange"],"language_level":"Intermediate","first_name":"OMG", "last_name":"oommgg","study_buddy_active":true,"about":"testing about","myway_habits":"my habits","study_buddy_bio":"the bio","goals":["Pronunciation"], "country_en":"new country","country_ja":"jap new c","state_en":"new state","state_ja":"jap new state", "city_en":"new city","city_ja":"jap new city"}
         */

        //update users table this works

        const resultsUsers = db.query(
            `UPDATE users 
            SET ${query} 
            WHERE id = $1`, values
        );

        await updateManyToMany(data.goals, id, 'goals', 'goals_users', 'user_id', 'goal_id')
        await updateManyToMany(data.study_buddy_types, id, 'study_buddy_types', 'study_buddy_types_users', 'user_id', 'study_buddy_type_id')


        return 'done'
    }


    /** Given a username, return data about user.
     *
     * Returns { username, first_name, last_name, is_admin, jobs }
     *   where jobs is { id, title, company_handle, company_name, state }
     *
     * Throws NotFoundError if user not found.
     **/

    static async getPrivate(id) {

        const userRes = await db.query(
            `${privateBaseQuery}
            WHERE u.id = $1`,
            [id],
        );

        const user = userRes.rows[0];

        if (!user) throw new NotFoundError('NOT_FOUND');
        delete user.password

        const studyBuddies = await getManyToManyData('study_buddy_types', 'study_buddy_types_users', 'user_id', 'study_buddy_type_id', id)
        user.study_buddy_types = studyBuddies.map(a => a.name)
        const goals = await getManyToManyData('goals', 'goals_users', 'user_id', 'goal_id', id)
        user.goals = goals.map(a => a.name)

        return user;
    }


    static async getPublic(username) {
        const userRes = await db.query(
            `${baseQuery}
            WHERE u.username = $1`,
            [username],
        );

        const user = userRes.rows[0];
        if (!user) throw new NotFoundError(`NOT_FOUND`);

        const studyBuddies = await getManyToManyData('study_buddy_types', 'study_buddy_types_users', 'user_id', 'study_buddy_type_id', id)
        user.study_buddy_types = studyBuddies.map(a => a.name)
        return user;
    }

    /**
     * Accepts username or email and password and updates the user record with the  password
     * 
     * @returns id, username and role
     */

    static async setPassword(username = null, email = null, password) {
        const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
        // try to find the user
        const query = username ? 'username' : 'email'
        const queryData = username ? username : email
        const result = await db.query(
            `UPDATE users SET password = ${hashedPassword}
            WHERE ${query} = $1
            RETURNING id, username, role`,
            [queryData],
        );

        const user = result.rows[0];
        return user;
    }

}


module.exports = User;
