"use strict";

const db = require("../db");

const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
} = require("../error");


class Message {

    /** Get all users that the logged in user has messaged
     *
     * Returns [id, username] on success and BadRequestError on duplicates
     *
     **/

    static async getUsersList(
        { id }) {

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
            `SELECT u.id,
            u.username,
            u.password,
            u.first_name,
            u.last_name,
            u.email,
            u.role,
            u.sign_up_date,
            u.last_login_date,
            l3.name as language_preference,
            c.name_en as country_en,
            c.name_ja as country_ja,
            cities.name_en as city_en,
            cities.name_ja as city_ja,
            states.name_en as state_en,
            states.name_ja as state_ja,
            genders.name as gender,
            u.about,
            u.myway_habits,
            ml.name as motivational_level,
            st.name as study_time,
            pa.join_date as premium_join_date,
            pa.end_date as premium_end_date,
            pa.raz_reading_level,
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
            LEFT JOIN languages l3 on l3.id=u.language_preference
            LEFT JOIN languages l on l.id=u.study_buddy_native_language_id
            LEFT JOIN languages l2 on l2.id=u.study_buddy_learning_language_id
            LEFT JOIN language_levels ll on ll.id=u.study_buddy_language_level_id
            LEFT JOIN timezones tz on tz.id=u.study_buddy_timezone_id
            LEFT JOIN age_ranges a on a.id=u.study_buddy_age_range_id
            LEFT JOIN premium_accts pa on pa.id=u.premium_acct_id
            LEFT JOIN motivation_levels ml on ml.id=u.myway_motivation_level_id
            LEFT JOIN study_time st on st.id=u.myway_study_time_id
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
        console.log('got result', result.rows)
        const user = result.rows[0];
        return user;

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

        const userRes = await db.query(
            `SELECT u.id,
                u.username,
                u.first_name,
                u.last_name,
                u.email,
                u.role,
                u.sign_up_date,
                u.last_login_date,
                l3.name as language_preference,
                c.name_en as country_en,
                c.name_ja as country_ja,
                cities.name_en as city_en,
                cities.name_ja as city_ja,
                states.name_en as state_en,
                states.name_ja as state_ja,
                genders.name as gender,
                u.about,
                u.myway_habits,
                ml.name as motivational_level,
                st.name as study_time,
                pa.join_date as premium_join_date,
                pa.end_date as premium_end_date,
                pa.raz_reading_level,
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
            LEFT JOIN languages l3 on l3.id=u.language_preference
            LEFT JOIN languages l on l.id=u.study_buddy_native_language_id
            LEFT JOIN languages l2 on l2.id=u.study_buddy_learning_language_id
            LEFT JOIN language_levels ll on ll.id=u.study_buddy_language_level_id
            LEFT JOIN timezones tz on tz.id=u.study_buddy_timezone_id
            LEFT JOIN age_ranges a on a.id=u.study_buddy_age_range_id
            LEFT JOIN premium_accts pa on pa.id=u.premium_acct_id
            LEFT JOIN motivation_levels ml on ml.id=u.myway_motivation_level_id
            LEFT JOIN study_time st on st.id=u.myway_study_time_id
            WHERE u.username = $1`,
            [username],
        );

        const user = userRes.rows[0];

        if (!user) throw new NotFoundError('NOT_FOUND');

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
                  c.name_en as country_en,
                c.name_ja as country_ja,
                cities.name_en as city_en,
                cities.name_ja as city_ja,
                states.name_en as state_en,
                states.name_ja as state_ja,
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

        if (!user) throw new NotFoundError(`NOT_FOUND`);

        // const userApplicationsRes = await db.query(
        //     `SELECT a.job_id
        //    FROM applications AS a
        //    WHERE a.username = $1`, [username]);

        // user.applications = userApplicationsRes.rows.map(a => a.job_id);
        return user;
    }

    static async setPassword(username = null, email = null, password) {
        const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
        // try to find the user
        const query = username ? 'username' : 'email'
        const queryData = username ? username : email
        const result = await db.query(
            `UPDATE users SET password =${hashedPassword}
            WHERE ${query} = $1
            RETURNING id, username,role`,
            [queryData],
        );
        console.log('got result of password change', result.rows)
        const user = result.rows[0];
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


module.exports = Message;
