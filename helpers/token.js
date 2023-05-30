const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

function generateToken(id, role) {
    let payload = {
        id: id,
        role: role
    }
    console.log(id, role)
    return jwt.sign(payload, SECRET_KEY)
}

module.exports = { generateToken }