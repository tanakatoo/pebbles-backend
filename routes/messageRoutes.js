const express = require('express')
const router = new express.Router()
const { authenticateJWT, isMustBeLoggedIn } = require("../middleware/auth")
const Message = require('../models/messageModel')
const { BadRequestError } = require('../error')


//testing done
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

        if (typeof (msg) !== 'string') {
            throw new BadRequestError("not a valid type")
        }

        const { username } = req.params

        const result = await Message.sendMsg(res.locals.user.id, username, msg)

        return res.status(201).json(result)

    } catch (e) {

        return next(e)
    }
})


//testing done
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

        return next(e)
    }
})


//not part of frontend yet, so not tested
/**works
 * For logged in user to search in their contacts
 * 
 * returns [{from_user_id, to_user_id,msg,sent_at,read}]
 */
router.get('/search', authenticateJWT, isMustBeLoggedIn, async (req, res, next) => {
    //need to check that the to_user has not blocked this user
    try {

        const result = await Message.getLatestMessageList(res.locals.user.id)
        return res.status(200).json(result)

    } catch (e) {

        return next(e)
    }
})


//testing done
/**works
 * For logged in user to get all the messages for one user
 * 
 * returns [{from_user_id, to_user_id,msg,sent_at,read}]
 */
router.get('/:username', authenticateJWT, isMustBeLoggedIn, async (req, res, next) => {

    try {
        const { username } = req.params
        const result = await Message.getMessages(username, res.locals.user.id, res.locals.user.username)
        return res.status(200).json(result)

    } catch (e) {

        return next(e)
    }
})

module.exports = router;