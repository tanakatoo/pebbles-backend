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
        const isLoggedIn = req.loggedIn
        const isCorrectUser = req.correctUser
        const username = req.params.username

        if (isLoggedIn && isCorrectUser) {
            //user is logged in and accessing their own profile
            console.log('loggeed in and correct user')
            userData = await User.getPrivate(username)
            console.log('logged in is', req.loggedIn, 'params is', req.params.username, 'correct user is', req.correctUser)
        } else {
            //user is logged in or not but accessing someone else's profile
            userData = await User.getPublic(username)
        }
        return res.status(200).json({ ...userData, isLoggedIn: isLoggedIn, isCorrectUser: isCorrectUser })

    } catch (e) {
        return next(e)
    }
})

// router.get('/:username',)



module.exports = router;