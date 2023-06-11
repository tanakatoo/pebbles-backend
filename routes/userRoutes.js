const express = require('express')
const router = new express.Router()
const { authenticateJWT, isCorrectUserOrAdmin, isMustBeLoggedIn, isMustBeCorrectUserOrAdmin } = require("../middleware/auth")
const User = require('../models/userModel')
const Message = require('../models/messageModel')


/**
 * For user to access profiles
 * if they are logged in and it is their own profile they are getting, then get all the information
 * otherwise get only the public information
 */
router.get('/:username', authenticateJWT, isCorrectUserOrAdmin, async (req, res, next) => {

    try {
        const loggedIn = req.loggedIn
        const isCorrectUser = req.correctUser
        const username = req.params.username

        if (loggedIn && isCorrectUser) {
            //user is logged in and accessing their own profile
            userData = await User.getPrivate(username)
        } else {
            //user is logged in or not but accessing someone else's profile
            userData = await User.getPublic(username)
        }
        return res.status(200).json({ ...userData })

    } catch (e) {
        return next(e)
    }
})


/**
 * For logged in user to unblock a user
 * parameters (id, unblock_id)
 * 
 * returns status 204, no body
 */
router.delete('/unblock', authenticateJWT, isMustBeCorrectUserOrAdmin, async (req, res, next) => {

    try {
        const { id, unblock_id } = req.body

        const result = await User.unblockUser(id, unblock_id)
        return res.status(204).json(result)

    } catch (e) {
        return next(e)
    }
})

/**
 * Return all study buddies
 */

// router.get('/:username',)



module.exports = router;