const express = require('express')
const router = new express.Router()
const { authenticateJWT, isCorrectUser, isMustBeLoggedIn } = require("../middleware/auth")
const User = require('../models/userModel')
const { sendToUs } = require('../helpers/emailing')
const { UnauthorizedError, BadRequestError } = require('../error')


//testing donw
/** WORKS
 * sends email to us from contact us page
 * 
 * returns status 204, no body
 */
router.post('/', async (req, res, next) => {

    try {

        const data = req.body

        if (!data || Object.keys(data).length === 0 || data === '') {
            throw new BadRequestError('no data')
        }
        sendToUs(data)
        return res.status(200).json("sent")

    } catch (e) {
        return next(e)
    }
})





module.exports = router;