const express = require('express')
const router = new express.Router()
const { authenticateJWT, isMustBeLoggedIn } = require("../middleware/auth")
const Message = require('../models/messageModel')


/**WORKS
 * For logged in user to send message to another user 
 * parameters ( msg)
 * 
 * returns {from_user_id,to_user_id,msg,sent_at}
 */
router.post('/:username/send', authenticateJWT, isMustBeLoggedIn, async (req, res, next) => {
    //need to check that the to_user has not blocked this user
    try {
        const { msg } = req.body
        const { username } = req.params
        const result = await Message.sendMsg(res.locals.user.id, username, msg)
        return res.status(201).json(result)

    } catch (e) {
        console.log('in blocked user routes,', e)
        return next(e)
    }
})



/**works
 * For logged in user to get the latest messages from all their connections
 * 
 * returns [{from_user_id, to_user_id,msg,sent_at,read}]
 */
router.get('/', authenticateJWT, isMustBeLoggedIn, async (req, res, next) => {
    //need to check that the to_user has not blocked this user
    try {

        const result = await Message.getLatestMessageList(res.locals.user.id)
        return res.status(200).json(result)

    } catch (e) {
        console.log('in blocked user routes,', e)
        return next(e)
    }
})

/**works
 * For logged in user to get all the messages for one user
 * 
 * returns [{from_user_id, to_user_id,msg,sent_at,read}]
 */
router.get('/:username', authenticateJWT, isMustBeLoggedIn, async (req, res, next) => {
    console.log('getting message')
    try {
        const { username } = req.params
        const result = await Message.getMessages(username, res.locals.user.id)
        return res.status(200).json(result)

    } catch (e) {
        console.log('in blocked user routes,', e)
        return next(e)
    }
})

module.exports = router;