const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

function generateToken(id, username) {
    let payload = {
        id: id,
        username: username
    }

    return jwt.sign(payload, SECRET_KEY)
}

function generateForgotPasswordToken(id) {

    let payload = {
        id: id
    }
    const x = jwt.sign(payload, SECRET_KEY, { expiresIn: '15m' })

    return jwt.sign(payload, SECRET_KEY, { expiresIn: '15m' })
}

module.exports = { generateToken, generateForgotPasswordToken }