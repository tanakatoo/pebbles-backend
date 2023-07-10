"use strict";

require('dotenv').config()


const SECRET_KEY = process.env.SECRET_KEY || "secret-dev";
const PORT = +process.env.PORT || 3001;
const BCRYPT_WORK_FACTOR = 12

const googleClientId = process.env.GOOGLE_OAUTH_CLIENT_ID
const googleClientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET
const googleOauthRedirect = process.env.GOOGLE_OAUTH_REDIRECT_URL


// Use dev database, testing database, or via env var, production database
function getDatabaseUri() {


    return (process.env.NODE_ENV === "test")
        ? "postgresql:///pebbles_test"
        : `postgresql:///${process.env.DATABASE_URL}` || "postgresql:///pebbles";
}

console.log("Database:", getDatabaseUri());

module.exports = {
    SECRET_KEY,
    PORT,
    BCRYPT_WORK_FACTOR,
    getDatabaseUri,
    googleClientId,
    googleClientSecret,
    googleOauthRedirect
};