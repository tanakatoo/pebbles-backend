const express = require('express')
const jsonschema = require('jsonschema')
const passport = require('passport')
const GoogleStrategy = require('passport-google-oidc')
const router = express.Router();
const userRegisterSchema = require("../schemas/userRegister.json")
const { BadRequestError } = require("../error")
const User = require("../models/userModel")


router.get('/login', function (req, res, next) {
    res.render('login');
});

router.get('/login/google', passport.authenticate('google'));

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
        const token = createToken(newUser)

    } catch (e) {
        return next(e)
    }
    // res.json({ users: USERS })
})


module.exports = router;