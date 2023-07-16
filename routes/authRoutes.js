const express = require('express')
const jsonschema = require('jsonschema')
// const passport = require('passport')
// const GoogleStrategy = require('passport-google-oidc')
const router = express.Router();
const userRegisterSchema = require("../schemas/userRegister.json")
const userLoginSchema = require("../schemas/userLogin.json")
const changePasswordSchema = require("../schemas/changePassword.json")
const setPasswordSchema = require("../schemas/setPassword.json")

const { BadRequestError, NotFoundError } = require("../error")
const User = require("../models/userModel")
const { generateToken, generateForgotPasswordToken } = require("../helpers/token")
const validatorPkg = require("validator")
const { sendForgotPassword, sendRegister } = require("../helpers/emailing")
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

//done testing 
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
        const user = await User.getPrivate(userToken.username)
        return res.status(201).json({ token, user })
    } catch (e) {
        return next(e)
    }
});

//done testing
router.post('/change-password', async (req, res, next) => {
    try {
        //validate data

        const validator = jsonschema.validate(req.body, changePasswordSchema)
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
            sendForgotPassword(user.email,
                user.username,
                "PASSWORD_RESET",
                lang,
                `${process.env.DOMAIN_URL}/reset-password?token=${token}`
            )
            console.log('user is found so sending email')
            return res.status(201).json('completed')
        } else {
            throw new NotFoundError("NOT_FOUND")
        }




    } catch (e) {
        return next(e)
    }
});

//done testing
router.post('/set-password', async (req, res, next) => {
    try {
        //validate data
        const validator = jsonschema.validate(req.body, setPasswordSchema)
        if (!validator.valid) {

            const errs = validator.errors.map(e => e.stack)
            throw new BadRequestError(errs)
        }
        const { password, lang, token } = req.body
        //check that we can get id from token
        const id = jwt.verify(token, SECRET_KEY).id
        console.log('got id from token', id)

        //set password in db
        console.log('estting password,', id, password)
        const passwordSetUser = await User.setPassword(id, password)

        console.log('user is', passwordSetUser === true)
        if (passwordSetUser) {
            //return token
            const token = generateToken(passwordSetUser.id, passwordSetUser.username, passwordSetUser.role)
            const user = await User.getPrivate(passwordSetUser.username)
            return res.status(201).json({ token, user })
        }
        //return token

        throw new BadRequestError("password could not be set")
    } catch (e) {
        return next(e)
    }
});


//done test
router.post('/register', async (req, res, next) => {
    try {
        //validate data
        const { username, password, email, lang } = req.body

        const validator = jsonschema.validate(req.body, userRegisterSchema)
        if (!validator.valid) {

            const errs = validator.errors.map(e => e.stack)
            throw new BadRequestError(errs)
        }

        const newUser = await User.register({ ...req.body })
        const token = generateToken(newUser.id, newUser.username, newUser.role)

        if (newUser) {
            sendRegister(newUser.email,
                newUser.username,
                "REGISTERED",
                lang
            )
        }
        //log them in, so we get their information 
        const userInfo = await User.getPrivate(username)
        userInfo.myProfile = true

        return res.status(201).json({ token: token, user: userInfo })
    } catch (e) {
        return next(e)
    }
    // res.json({ users: USERS })
})


module.exports = router;