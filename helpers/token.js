const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

function generateToken(id, username, role) {
    let payload = {
        id: id,
        username: username,
        role: role
    }
    return jwt.sign(payload, SECRET_KEY)
}

function generateForgotPasswordToken(id) {
    let payload = {
        id: id
    }
    return jwt.sign(payload, SECRET_KEY, { expiresIn: '15m' })
}

module.exports = { generateToken, generateForgotPasswordToken }