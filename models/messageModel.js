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

    /** testing done
    * Check that the user has not blocked the logged in user, if so return "unauthorized"
    * Check that the logged in user has not blocked the user to send messages to, if so, return BadRequestError
    * else return "success"
    */
    static async sendMsg(id, username, msg) {

        const user_id = await getUserID(username)
        console.log('in msg model to user id', user_id, id, username, msg)
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
        console.log('insert already, returning this', result)
        return result.rows[0]
    }


    /**testing complete 
     * Get all users that the logged in user has messaged and the latest message without the blocked users
         *
         * Returns [from_user_name,to_user_name, msg, sent_at] on success ordered by unread first
         *
         **/

    static async getLatestMessageList(id) {

        //get a list of users that the logged in user has messages for and filter out those that the user has blocked
        //this is so users can block more users
        const latestMessageList = await db.query(
            `SELECT uTo.avatar as toAvatar, uFrom.avatar as fromAvatar, uFrom.username as from ,uTo.username as to, subquery.from_user_id, subquery.to_user_id, subquery.msg, subquery.sent_at, subquery.read
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
        INNER JOIN users uFrom on uFrom.id=subquery.from_user_id
        INNER JOIN users uTo on uTo.id=subquery.to_user_id
        WHERE rn = 1
        ORDER BY read DESC, sent_at DESC`, [id]
        )

        return latestMessageList.rows;
    }



    /**  testing done
     * Get conversation for logged in user and another user
    *
    * Returns [from_user_name,to_user_name, msg, sent_at] on success ordered by latest date
    *
    **/
    static async getMessages(username, id, loggedinUsername) {

        //get id from username
        const user_id = await getUserID(username)

        // //check if I blocked user
        // //should not throw error as there is no ui to display messages of blocked user
        const iBlockedUser = await blockedUser(user_id, id, user_id)

        //get a list of users that the logged in user has messages for and filter out those that the user has blocked
        //this is so users can block more users
        let messages = await db.query(
            `SELECT uTo.avatar as toAvatar, uFrom.avatar as fromAvatar, 
            uFrom.username as from ,uTo.username as to, 
            m.from_user_id, m.to_user_id, m.msg, m.sent_at, m.read
            FROM messages m
            INNER JOIN users uFrom on uFrom.id=m.from_user_id
            INNER JOIN users uTo on uTo.id=m.to_user_id
            WHERE (m.from_user_id=$1 AND m.to_user_id=$2)
                OR (m.from_user_id=$2 AND m.to_user_id=$1)
            
            ORDER BY sent_at DESC`, [id, user_id]
        )

        //now we set all of the flags to "read" for the logged in user
        const setRead = await db.query(
            `UPDATE messages SET read=true 
            WHERE (from_user_id=$2 AND to_user_id=$1)`, [id, user_id]
        )

        //if we don't find a conversation it means they want to start a conversation, so return the 
        //username and avatar but in the same format as returning a message
        if (messages.rows.length === 0) {
            const onlyUser = await db.query(
                `SELECT avatar as toavatar, username as to, '' as fromavatar, $2 as from
                FROM users
                WHERE username=$1`, [username, loggedinUsername]
            )

            if (onlyUser.rows.length === 0) {
                throw new NotFoundError
            } else {
                messages = onlyUser
            }
        }

        return messages.rows;
    }
}


module.exports = Message;
