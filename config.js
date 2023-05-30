"use strict";

require('dotenv').config()


const SECRET_KEY = process.env.SECRET_KEY || "secret-dev";
const PORT = +process.env.PORT || 3001;
const BCRYPT_WORK_FACTOR = 12

// Use dev database, testing database, or via env var, production database
function getDatabaseUri() {
    return (process.env.NODE_ENV === "test")
        ? "pebbles_test"
        : process.env.DATABASE_URL || "pebbles";
}

console.log("Database:", getDatabaseUri());

module.exports = {
    SECRET_KEY,
    PORT,
    BCRYPT_WORK_FACTOR,
    getDatabaseUri,
};