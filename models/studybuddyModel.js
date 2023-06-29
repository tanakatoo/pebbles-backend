"use strict";

const db = require("../db");
const User = require("./userModel")
const { getUserID } = require('../helpers/getUserID')
const { blockedUser } = require('../helpers/blockedUser')
const { baseQuery } = require('../helpers/variables')
const { getManyToManyData } = require("../helpers/getManyToManyData")

const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
    ExpressError
} = require("../error");


class Studybuddy {

    /**
     * gets list of study buddies that are active ordered by activate date, 30 at a time
     * @param (page) page indicates page number 
     * @returns [{study buddy properties}] 
     */

    static async getList(page) {

        const numToDisplayPerPage = 2;
        const buddyBaseQuery = `${baseQuery} 
            WHERE u.study_buddy_active = true
            ORDER BY study_buddy_activate_date DESC
            LIMIT ${numToDisplayPerPage}`;

        let query = '';
        let offset = 0;
        if (page > 1) {
            offset = (page - 1) * numToDisplayPerPage
            query = `OFFSET $1`
        };

        const userRes = await db.query(
            buddyBaseQuery + query, page > 1 ? [offset] : []
        );

        const users = userRes.rows;

        //for each user, get the study buddy type and add it to the return variable
        let returnStudyBuddies = await Promise.all(users.map(async (i) => {
            console.log(i)
            let studyTypes = await getManyToManyData('study_buddy_types',
                'study_buddy_types_users',
                'user_id',
                'study_buddy_type_id',
                i.id);
            i.study_buddy_types = studyTypes.map(a => a.name);
            return i;

        }));

        return users;
    }

    /**works
        * gets list of study buddies that are active ordered by activate date, 30 at a time
        * @param (page) page indicates page number 
        * @returns [{study buddy properties}] 
        */

    static async searchList(page, word, language_level, gender, timezone, age) {
        const numToDisplayPerPage = 3

        let filters = ''
        filters += word ? ` AND (u.study_buddy_bio ILIKE '${word}' OR u.username ILIKE '${word}') ` : ''
        filters += language_level ? ` AND (ll.name = '${language_level}' ) ` : ''
        filters += gender ? ` AND (genders.name = '${gender}' ) ` : ''
        filters += timezone ? ` AND (tz.name = '${timezone}' ) ` : ''
        filters += age ? ` AND (a.name = '${age}' ) ` : ''

        let myBaseQuery = `${baseQuery} 
                            WHERE u.study_buddy_active = true
                            ${filters} 
                            LIMIT ${numToDisplayPerPage}`

        let query = ''
        let offset = 0
        if (page > 1) {
            offset = (page - 1) * numToDisplayPerPage
            query = `OFFSET $1`
        }
        console.log('base and query is', query)
        console.log(myBaseQuery + query)
        const userRes = await db.query(
            myBaseQuery + query, page > 1 ? [offset] : []
        );

        const user = userRes.rows;
        console.log(user)
        return user;
    }



}


module.exports = Studybuddy;
