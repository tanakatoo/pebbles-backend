"use strict";

const db = require("../db");
const User = require("./userModel")
const { getUserID } = require('../helpers/getUserID')
const { blockedUser } = require('../helpers/blockedUser')
const { baseQuery } = require('../helpers/variables')
const { getManyToManyData } = require("../helpers/getManyToManyData")
const { arrayWhereClause } = require('../helpers/filterSQL')

const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
    ExpressError
} = require("../error");
const { types } = require("pg");


class Studybuddy {

    /**testing done
     * gets list of study buddies that are active ordered by activate date, 30 at a time
     * @param (page) page indicates page number 
     * @returns [{study buddy properties}] 
     */

    static async getList(page) {

        const numToDisplayPerPage = 30;
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

    /**testing done
     * works
        * gets list of study buddies that are active ordered by activate date, 30 at a time
        * filtered by criteria
        * @param (page) page indicates page number 
        * @returns [{study buddy properties}] 
        */

    static async searchList(page, word, language_level, gender, timezone, age, type, native_lang, learning_lang) {
        const numToDisplayPerPage = 30;

        let index = 1;
        let values = [];

        let filters = ' WHERE u.study_buddy_active = $1';
        index++;
        values.push(true);

        if (word) {
            filters += word ? ` AND (u.study_buddy_bio ILIKE $2 OR 
                u.username ILIKE $2 OR
                u.study_buddy_purpose ILIKE $2 OR
                u.name ILIKE $2) ` : ''
            values.push(`%${word}%`);
            index++;;
        };


        //these are all arrays which we need to concatenate
        [filters, index, values] = arrayWhereClause(native_lang, 'l.name', filters, index, values);
        [filters, index, values] = arrayWhereClause(learning_lang, 'l2.name', filters, index, values);
        [filters, index, values] = arrayWhereClause(language_level, 'll.name', filters, index, values);
        [filters, index, values] = arrayWhereClause(gender, 'genders.name', filters, index, values);
        [filters, index, values] = arrayWhereClause(timezone, 'tz.name', filters, index, values);
        [filters, index, values] = arrayWhereClause(age, 'a.name', filters, index, values);

        let offsetQuery = '';
        if (page > 1) {

            let offset = (page - 1) * numToDisplayPerPage;
            offsetQuery = ` OFFSET $${index}`;
            index++;
            values.push(offset);
        };

        let userRes;
        //add the study buddy filter
        if (type && type.length > 0) {
            let params = []
            for (let i = 0; i < type.length; i++) {
                params.push('$' + index);
                index++
                values.push(type[i])
            };

            userRes = await db.query(
                `${baseQuery}
                INNER JOIN study_buddy_types_users sbu ON sbu.user_id = u.id
                INNER JOIN study_buddy_types sb ON sb.id = sbu.study_buddy_type_id
                ${filters} AND sb.name in (${params.join(',')}) 
                LIMIT ${numToDisplayPerPage} ${offsetQuery}`, values
            );

        } else {

            userRes = await db.query(
                baseQuery + filters + offsetQuery, values
            );
        };
        console.log('query is', baseQuery + filters + offsetQuery, values)
        const user = userRes.rows;
        //get study buddy types as array and return
        let usersWithType = [];
        if (user.length > 0) {
            console.log('in types')
            usersWithType = await Promise.all(user.map(async u => {
                const res = await getManyToManyData('study_buddy_types', 'study_buddy_types_users', 'user_id', 'study_buddy_type_id', u.id);
                u.study_buddy_types = res.map(r => r.name);
            }));
        }


        return user;
    }



}


module.exports = Studybuddy;
