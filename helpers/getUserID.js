const db = require("../db");
const { NotFoundError } = require("../error")

async function getUserID(username) {
    console.log('checking username,', username)
    //get user id of the user to send message to
    const userResult = await db.query(`SELECT id FROM users WHERE username=$1`, [username])

    if (userResult.rows.length == 0) {
        throw new NotFoundError
    }

    const user_id = userResult.rows[0].id

    return user_id
}

module.exports = { getUserID }