const express = require('express')
const jsonschema = require('jsonschema')
// const passport = require('passport')
// const GoogleStrategy = require('passport-google-oidc')
const router = express.Router();
const userRegisterSchema = require("../schemas/userRegister.json")
const userLoginSchema = require("../schemas/userLogin.json")
const passwordSchema = require("../schemas/password.json")
const { BadRequestError } = require("../error")
const User = require("../models/userModel")
const { generateToken, generateForgotPasswordToken } = require("../helpers/token")
const validatorPkg = require("validator")
const sendEmail = require("../helpers/emailing")


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
        let userToken
        if (validatorPkg.isEmail(username)) {
            userToken = await User.login(null, username, password)
        } else {
            userToken = await User.login(username, null, password)
        }
        //return token
        const token = generateToken(userToken.id, userToken.username, userToken.role)

        //get private profile and return that
        const user = await User.getPrivate(userToken.id)
        return res.status(201).json({ token, user })
    } catch (e) {
        return next(e)
    }
});


router.post('/password', async (req, res, next) => {
    try {
        //validate data

        const validator = jsonschema.validate(req.body, passwordSchema)
        if (!validator.valid) {

            const errs = validator.errors.map(e => e.stack)
            throw new BadRequestError(errs)
        }
        const { username, lang } = req.body
        //see if identifier is an email
        let user
        if (validatorPkg.isEmail(username)) {
            user = await User.findUser(null, username)
        } else {
            user = await User.findUser(username, null)
        }
        if (user) {
            const token = generateForgotPasswordToken(user.id)

            //if user is found, send email here
            //to, name, type, lang,link = ''
            sendEmail('reach.pebbles@gmail.com',
                username,
                "PASSWORD_RESET",
                lang,
                `${process.env.DOMAIN_URL}/reset-password?token=${token}`,
                "Password reset"
            )
            console.log('user is found so sending email')

        }
        return res.status(201).json('completed')



    } catch (e) {
        return next(e)
    }
});


router.post('/set-password', async (req, res, next) => {
    try {
        //validate data
        const validator = jsonschema.validate(req.body, passwordSchema)
        if (!validator.valid) {

            const errs = validator.errors.map(e => e.stack)
            throw new BadRequestError(errs)
        }
        const { username, password } = req.body
        //see if identifier is an email
        let user
        if (validatorPkg.isEmail(username)) {
            user = await User.setPassword(null, username, password)
        } else {
            user = await User.setPassword(username, null, password)
        }

        //return token
        const token = generateToken(user.id, user.username, user.role)
        return res.status(201).json(token)
    } catch (e) {
        return next(e)
    }
});

router.post('/register', async (req, res, next) => {
    try {
        //validate data
        const validator = jsonschema.validate(req.body, userRegisterSchema)
        if (!validator.valid) {

            const errs = validator.errors.map(e => e.stack)
            throw new BadRequestError(errs)
        }

        const newUser = await User.register({ ...req.body })
        const token = generateToken(newUser.id, newUser.username, newUser.role)
        console.log('registered', newUser, token)
        console.log()
        return res.status(201).json(token)
    } catch (e) {
        return next(e)
    }
    // res.json({ users: USERS })
})


module.exports = router;