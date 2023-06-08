const express = require('express')
const router = new express.Router()
const { authenticateJWT, isCorrectUserOrAdmin, isLoggedIn } = require("../middleware/auth")
const User = require('../models/userModel')


/**
 * For user to access profiles
 * if they are logged in and it is their own profile they are getting, then get all the information
 * otherwise get only the public information
 */
router.get('/:username', authenticateJWT, isLoggedIn, isCorrectUserOrAdmin, async (req, res, next) => {

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

// router.get('/:username',)



module.exports = router;