const express = require('express')
const router = new express.Router()
const { authenticateJWT, isMustBeLoggedIn, isMustBeCorrectUserOrAdmin } = require("../middleware/auth")
const Message = require('../models/messageModel')




/**
 * Return all study buddies
 */

// router.get('/:username',)



module.exports = router;