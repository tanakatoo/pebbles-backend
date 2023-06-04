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

module.exports = { generateToken }