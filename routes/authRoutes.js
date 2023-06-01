const express = require('express')
const jsonschema = require('jsonschema')
// const passport = require('passport')
// const GoogleStrategy = require('passport-google-oidc')
const router = express.Router();
const userRegisterSchema = require("../schemas/userRegister.json")
const userLoginSchema = require("../schemas/userLogin.json")
const { BadRequestError } = require("../error")
const User = require("../models/userModel")
const { generateToken } = require("../helpers/token")
const validatorPkg = require("validator")


router.post('/login', async (req, res, next) => {
    try {
        //validate data

        const validator = jsonschema.validate(req.body, userLoginSchema)
        if (!validator.valid) {

            const errs = validator.errors.map(e => e.stack)
            throw new BadRequestError(errs)
        }
        const { username, password } = req.body
        //see if identifier is an email
        let user
        if (validatorPkg.isEmail(username)) {
            console.log('it is a email')
            user = await User.login(null, username, password)
        } else {
            console.log('itis an username')
            user = await User.login(username, null, password)
        }
        //return token
        const token = generateToken(user.id, user.role)
        return res.status(201).json(token)
    } catch (e) {
        next(e)
    }
});

// router.get('/login/google', passport.authenticate('google'));

/*
registers new user
parameters: 
*/

router.post('/register', async (req, res, next) => {
    try {
        //validate data

        const validator = jsonschema.validate(req.body, userRegisterSchema)
        if (!validator.valid) {

            const errs = validator.errors.map(e => e.stack)
            throw new BadRequestError(errs)
        }

        const newUser = await User.register({ ...req.body })
        const token = generateToken(newUser.id, newUser.role)
        console.log('registered', newUser, token)
        return res.status(201).json(token)
    } catch (e) {
        return next(e)
    }
    // res.json({ users: USERS })
})


module.exports = router;