"use strict";

//selects from the backend to get data

const db = require("../db");
const bcrypt = require("bcrypt");
// const userErrors = require('../json/userErrors.json')
const { BCRYPT_WORK_FACTOR } = require('../config')
// const { sqlForPartialUpdate } = require("../helpers/sql");
const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
} = require("../error");


class User {

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

            throw new BadRequestError("duplicateEmail");
        }
        //check if username is already used
        const checkDuplicateUsername = await db.query(
            `SELECT username
            FROM users
            WHERE username = $1`,
            [username],
        );
        if (checkDuplicateUsername.rows[0]) {

            throw new BadRequestError(userErrors.usernameTaken);
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
            `SELECT id,username,
                      password,
                      email,
                      role
               FROM users
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

        throw new UnauthorizedError(userErrors.invalidCredentials);
    }
    // /** Find all users.
    //  *
    //  * Returns [{ username, first_name, last_name, email, is_admin }, ...]
    //  **/

    // static async findAll() {
    //     const result = await db.query(
    //         `SELECT username,
    //               first_name AS "firstName",
    //               last_name AS "lastName",
    //               email,
    //               is_admin AS "isAdmin"
    //        FROM users
    //        ORDER BY username`,
    //     );

    //     return result.rows;
    // }

    /** Given a username, return data about user.
     *
     * Returns { username, first_name, last_name, is_admin, jobs }
     *   where jobs is { id, title, company_handle, company_name, state }
     *
     * Throws NotFoundError if user not found.
     **/

    static async getPrivate(username) {
        console.log('username is', username)
        const userRes = await db.query(
            `SELECT *
           FROM users
           WHERE username = $1`,
            [username],
        );

        const user = userRes.rows[0];
        console.log('in private, user is', user)
        if (!user) throw new NotFoundError(`No user: ${username}`);

        // const userApplicationsRes = await db.query(
        //     `SELECT a.job_id
        //    FROM applications AS a
        //    WHERE a.username = $1`, [username]);

        // user.applications = userApplicationsRes.rows.map(a => a.job_id);
        delete user.password
        return user;
    }


    static async getPublic(username) {
        const userRes = await db.query(
            `SELECT u.username,
                  u.first_name,
                  u.last_name,
                  c.name as country,
                  cities.name as city,
                  states.name as state,
                  genders.name as gender,
                  u.about,
                  u.study_buddy_bio,
                  sbt.name as study_buddy_type,
                  l.name as native_language,
                  l2.name as learning_language,
                  ll.name as language_level,
                  tz.name as time_zone,
                  a.name as age_range,
                  u.study_buddy_active
           FROM users u
            LEFT JOIN countries c on c.id=u.country_id
            LEFT JOIN cities on cities.id=u.city_id
            LEFT JOIN states on states.id=u.state_id
            LEFT JOIN genders on genders.id=u.gender_id
            LEFT JOIN study_buddy_types sbt on sbt.id=u.study_buddy_type_id
            LEFT JOIN languages l on l.id=u.study_buddy_native_language_id
            LEFT JOIN languages l2 on l2.id=u.study_buddy_learning_language_id
            LEFT JOIN language_levels ll on ll.id=u.study_buddy_language_level_id
            LEFT JOIN timezones tz on tz.id=u.study_buddy_timezone_id
            LEFT JOIN age_ranges a on a.id=u.study_buddy_age_range_id
           WHERE u.username = $1`,
            [username],
        );

        const user = userRes.rows[0];

        if (!user) throw new NotFoundError(`No user: ${username}`);

        // const userApplicationsRes = await db.query(
        //     `SELECT a.job_id
        //    FROM applications AS a
        //    WHERE a.username = $1`, [username]);

        // user.applications = userApplicationsRes.rows.map(a => a.job_id);
        return user;
    }
    // /** Update user data with `data`.
    //  *
    //  * This is a "partial update" --- it's fine if data doesn't contain
    //  * all the fields; this only changes provided ones.
    //  *
    //  * Data can include:
    //  *   { firstName, lastName, password, email, isAdmin }
    //  *
    //  * Returns { username, firstName, lastName, email, isAdmin }
    //  *
    //  * Throws NotFoundError if not found.
    //  *
    //  * WARNING: this function can set a new password or make a user an admin.
    //  * Callers of this function must be certain they have validated inputs to this
    //  * or a serious security risks are opened.
    //  */

    // static async update(username, data) {
    //     if (data.password) {
    //         data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
    //     }

    //     const { setCols, values } = sqlForPartialUpdate(
    //         data,
    //         {
    //             firstName: "first_name",
    //             lastName: "last_name",
    //             isAdmin: "is_admin",
    //         });
    //     const usernameVarIdx = "$" + (values.length + 1);

    //     const querySql = `UPDATE users 
    //                   SET ${setCols} 
    //                   WHERE username = ${usernameVarIdx} 
    //                   RETURNING username,
    //                             first_name AS "firstName",
    //                             last_name AS "lastName",
    //                             email,
    //                             is_admin AS "isAdmin"`;
    //     const result = await db.query(querySql, [...values, username]);
    //     const user = result.rows[0];

    //     if (!user) throw new NotFoundError(`No user: ${username}`);

    //     delete user.password;
    //     return user;
    // }

    // /** Delete given user from database; returns undefined. */

    // static async remove(username) {
    //     let result = await db.query(
    //         `DELETE
    //        FROM users
    //        WHERE username = $1
    //        RETURNING username`,
    //         [username],
    //     );
    //     const user = result.rows[0];

    //     if (!user) throw new NotFoundError(`No user: ${username}`);
    // }

    // /** Apply for job: update db, returns undefined.
    //  *
    //  * - username: username applying for job
    //  * - jobId: job id
    //  **/

    // static async applyToJob(username, jobId) {
    //     const preCheck = await db.query(
    //         `SELECT id
    //        FROM jobs
    //        WHERE id = $1`, [jobId]);
    //     const job = preCheck.rows[0];

    //     if (!job) throw new NotFoundError(`No job: ${jobId}`);

    //     const preCheck2 = await db.query(
    //         `SELECT username
    //        FROM users
    //        WHERE username = $1`, [username]);
    //     const user = preCheck2.rows[0];

    //     if (!user) throw new NotFoundError(`No username: ${username}`);

    //     await db.query(
    //         `INSERT INTO applications (job_id, username)
    //        VALUES ($1, $2)`,
    //         [jobId, username]);
    // }
}


module.exports = User;
