const db = require("../db");
const { ExpressError } = require("../error")

async function blockedUser(user1, user2, blockedUser) {
    const blocked = await db.query(
        `SELECT blocked_user_id FROM blocked_users 
        WHERE blocked_user_id = $1 and user_id = $2`, [user1, user2]
    )
    console.log(user1, user2, blockedUser)
    console.log('blocked is', blocked.rows.find(b => b.blocked_user_id === blockedUser))
    //if from the list of blocked users, the user to send to is in that list then 
    if (!(blocked.rows.find(b => b.blocked_user_id === blockedUser) === undefined)) {
        console.log('found it blocked!')
        throw new ExpressError('blocked')
    }
    return false
}

module.exports = { blockedUser }