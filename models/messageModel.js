"use strict";

const db = require("../db");
const User = require("./userModel")
const { getUserID } = require('../helpers/getUserID')
const { blockedUser } = require('../helpers/blockedUser')

const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
    ExpressError
} = require("../error");


class Message {

    /** 
    * Check that the user has not blocked the logged in user, if so return "unauthorized"
    * Check that the logged in user has not blocked the user to send messages to, if so, return BadRequestError
    * else return "success"
    */
    static async sendMsg(id, username, msg) {

        const user_id = await getUserID(username)

        //did user block me
        //returns false, but it throws error if logged user is blocked
        const userBlockedMe = await blockedUser(id, user_id, id)

        //did I block user
        //this code should not run because there is no UI to send to blocked users
        const iBlockedUser = await blockedUser(user_id, id, user_id)

        const result = await db.query(
            `INSERT INTO messages (from_user_id, to_user_id,msg)
            VALUES ($1,$2,$3) RETURNING from_user_id, to_user_id, msg, sent_at`, [id, user_id, msg]
        )

        return result.rows[0]
    }


    /** Get all users that the logged in user has messaged and the latest message without the blocked users
         *
         * Returns [from_user_name,to_user_name, msg, sent_at] on success ordered by unread first
         *
         **/

    static async getLatestMessageList(id) {

        //get a list of users that the logged in user has messages for and filter out those that the user has blocked
        //this is so users can block more users
        const latestMessageList = await db.query(
            `SELECT from_user_id, to_user_id, msg, sent_at, read
            FROM(
                SELECT 
            from_user_id, to_user_id, msg, sent_at, read,
                ROW_NUMBER() OVER(PARTITION BY 
              CASE WHEN from_user_id = $1 THEN to_user_id
                   ELSE from_user_id
              END
              ORDER BY sent_at DESC) AS rn
        FROM(SELECT * FROM messages 
            WHERE 
            to_user_id not in (SELECT blocked_user_id 
                                FROM blocked_users 
                                WHERE user_id = $1) AND 
            from_user_id not in (SELECT blocked_user_id 
                            FROM blocked_users 
                            WHERE user_id = $1)) as subsubquery
          WHERE $1 IN(from_user_id, to_user_id)
        ) AS subquery
        WHERE rn = 1 ORDER BY read ASC`, [id]
        )

        return latestMessageList.rows;
    }

    /** Get all users that the logged in user has messaged and the latest message without the blocked users
             *
             * Returns [from_user_name,to_user_name, msg, sent_at] on success ordered by unread first
             *
             **/

    static async getMessages(username, id) {

        //get id from username
        const user_id = await getUserID(username)

        //check if I blocked user
        //should not throw error as there is no ui to display messages of blocked user
        const iBlockedUser = await blockedUser(user_id, id, user_id)


        //get a list of users that the logged in user has messages for and filter out those that the user has blocked
        //this is so users can block more users
        const messages = await db.query(
            `SELECT *
            FROM messages
            WHERE (from_user_id=$1 AND to_user_id=$2)
                OR (from_user_id=$2 AND to_user_id=$1)
            ORDER BY sent_at ASC`, [id, user_id]
        )

        console.log(messages.rows)
        return messages.rows;
    }



}


module.exports = Message;
