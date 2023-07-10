const express = require('express')
const router = new express.Router()
const { authenticateJWT, isCorrectUser, isMustBeLoggedIn } = require("../middleware/auth")
const User = require('../models/userModel')
const { sendToUs } = require('../helpers/emailing')
const { UnauthorizedError } = require('../error')


/** WORKS
 * For logged in user to unblock a user
 * parameters (id, unblock_id)
 * 
 * returns status 204, no body
 */
router.post('/', async (req, res, next) => {

    try {
        const data = req.body
        console.log('got in route', data)
        sendToUs(data)
        return res.status(200).json("sent")

    } catch (e) {
        return next(e)
    }
})





module.exports = router;