const express = require('express')
const router = new express.Router()
const { authenticateJWT, isCorrectUserOrAdmin, isMustBeLoggedIn } = require("../middleware/auth")
const User = require('../models/userModel')
const { getUserID } = require('../helpers/getUserID')
const { UnauthorizedError } = require('../error')


/** WORKS
 * For logged in user to unblock a user
 * parameters (id, unblock_id)
 * 
 * returns status 204, no body
 */
router.delete('/unblock/:username', authenticateJWT, isMustBeLoggedIn, async (req, res, next) => {

    try {
        const { username } = req.params
        const id = res.locals.user.id
        const result = await User.unblockUser(id, username)
        return res.status(204).json(result)

    } catch (e) {
        return next(e)
    }
})



/** WORKS
 * For logged in user to block a user
 * parameters (id)
 * 
 * returns [id]
 */
router.post('/block/:username', authenticateJWT, isMustBeLoggedIn, async (req, res, next) => {

    try {
        const { username } = req.params
        console.log('username', username)

        const id = res.locals.user.id
        const result = await User.blockUser(username, id)
        return res.status(204).json(result)

    } catch (e) {
        console.log('in blocked user routes,', e)
        return next(e)
    }
})

/** WORKS
 * For logged in user to display the blocked users
 * parameters (id)
 * 
 * returns [id]
 */
router.get('/blocked', authenticateJWT, isMustBeLoggedIn, async (req, res, next) => {

    try {
        const id = res.locals.user.id
        const result = await User.getBlockedUsers(id)
        return res.status(200).json(result)

    } catch (e) {
        console.log('in blocked user routes,', e)
        return next(e)
    }
})

/** 
 * Get a list of users that the logged in user is contacting - without blocked users
 * parameters (id)
 * 
 * returns [id]
 */
router.get('/contacts', authenticateJWT, isMustBeLoggedIn, async (req, res, next) => {

    try {
        const id = res.locals.user.id
        const result = await User.getUsersList(id)
        return res.status(200).json(result)

    } catch (e) {
        console.log('in blocked user routes,', e)
        return next(e)
    }
})


/** works
 * For logged in users to favourite another user
 * returns 201 if succcess, unauthorized if not logged in, notfound if user to favourite is not found
 */
router.post('/save/:username', authenticateJWT, isMustBeLoggedIn, async (req, res, next) => {

    try {

        const { username } = req.params
        const user_id = await getUserID(username)


        const id = res.locals.user.id
        console.log(user_id, id)
        const result = await User.saveUser(id, user_id)
        return res.status(201).json(result)

    } catch (e) {
        console.log('in save user routes,', e)
        return next(e)
    }
})



/** works
 * For logged in users to unfavourite another user
 * returns 204 if succcess, unauthorized if not logged in, notfound if user to favourite is not found
 */
router.delete('/unsave/:username', authenticateJWT, isMustBeLoggedIn, async (req, res, next) => {

    try {

        const { username } = req.params
        const user_id = await getUserID(username)


        const id = res.locals.user.id
        console.log(user_id, id)
        const result = await User.unsaveUser(id, user_id)
        return res.status(204).json(result)

    } catch (e) {
        console.log('in save user routes,', e)
        return next(e)
    }
})

/** works
 * For logged in users display all favourited users
 * returns 200 if succcess, unauthorized if not logged in, notfound if user to favourite is not found
 */
router.get('/saved', authenticateJWT, isMustBeLoggedIn, async (req, res, next) => {

    try {

        const id = res.locals.user.id
        const result = await User.saved(id)
        return res.status(200).json(result)

    } catch (e) {
        console.log('in save user routes,', e)
        return next(e)
    }
})


/** works
 * For user to edit their profiles
 * 
 */
router.patch('/:username', authenticateJWT, isCorrectUserOrAdmin, async (req, res, next) => {

    try {
        if (req.correctUser == false) {
            throw new UnauthorizedError
        }

        const id = res.locals.user.id
        let user = await User.update(id, req.body)

        if (user == 'done') {
            //get all user data
            user = await User.getPrivate(res.locals.user.username)
        }
        return res.status(200).json(user)

    } catch (e) {
        return next(e)
    }
})

/** WORKS
 * For user to access profiles
 * if they are logged in and it is their own profile they are getting, then get all the information
 * otherwise get only the public information
 */
router.get('/:username', authenticateJWT, isCorrectUserOrAdmin, async (req, res, next) => {

    try {
        const loggedIn = req.loggedIn
        const isCorrectUser = req.correctUser
        const username = req.params.username
        console.log(loggedIn, isCorrectUser, username)
        if (loggedIn && isCorrectUser) {
            console.log('getting private becauwe i am admin', username)
            userData = await User.getPrivate(username)
            userData.myProfile = true
        } else {
            //user is logged in or not but accessing someone else's profile
            userData = await User.getPublic(username)
        }
        return res.status(200).json({ ...userData })

    } catch (e) {
        return next(e)
    }
})


module.exports = router;