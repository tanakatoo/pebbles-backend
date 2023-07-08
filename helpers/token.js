const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

function generateToken(id, username) {
    let payload = {
        id: id,
        username: username
    }
    console.log('payoad is', id, username, SECRET_KEY)
    return jwt.sign(payload, SECRET_KEY)
}

function generateForgotPasswordToken(id) {
    console.log('generating token', id)
    let payload = {
        id: id
    }
    const x = jwt.sign(payload, SECRET_KEY, { expiresIn: '15m' })
    console.log('id is', jwt.verify(x, SECRET_KEY))
    return jwt.sign(payload, SECRET_KEY, { expiresIn: '15m' })
}

module.exports = { generateToken, generateForgotPasswordToken }