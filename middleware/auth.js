"use strict";

/** Convenience middleware to handle common auth cases in routes. */

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const { UnauthorizedError } = require("../error");


/** Middleware: Authenticate user.
 *
 * If a token was provided in the header, verify it, and, if valid, store the token res.locals.user
 * on res.locals (this will include user id and role
 *
 * It's not an error if no token was provided or if the token is not valid. 
 * It just means user is not logged in
 */

function authenticateJWT(req, res, next) {
    try {
        const authHeader = req.headers && req.headers.authorization;
        console.log('got header!', authHeader)
        if (authHeader) {
            const token = authHeader.replace(/^[Bb]earer /, "").trim();
            res.locals.user = jwt.verify(token, SECRET_KEY);
        }
        return next();
    } catch (err) {
        return next();
    }
}

/** Middleware to use to check if they are logged in
 *
 * If not, raises Unauthorized.
 */

function isLoggedIn(req, res, next) {
    try {
        if (!res.locals.user) {
            req.loggedIn = false

        } else {
            req.loggedIn = true
        }
        return next();
    } catch (err) {
        return next(err);
    }
}


/** Middleware to use when they are logged in as an admin user.
 *
 *  If not, raises Unauthorized.
 */

function ensureAdmin(req, res, next) {
    try {
        if (!res.locals.user || !res.locals.user.isAdmin) {
            throw new UnauthorizedError("UNAUTHORIZED");
        }
        return next();
    } catch (err) {
        return next(err);
    }
}

/** Middleware to use when they must provide a valid token & be user matching
 *  username provided as route param.
 *
 *  If not, raises Unauthorized.
 */

function isCorrectUserOrAdmin(req, res, next) {
    try {
        const user = res.locals.user;
        console.log('in correctuseror admin', user)
        if (!(user && (user.role === "admin" || user.username === req.params.username))) {
            // throw new UnauthorizedError();
            req.correctUser = false
        } else {
            req.correctUser = true
        }
        return next();
    } catch (err) {
        return next(err);
    }
}

/*See if token is the same as the user being requested 
token provided 
*/


module.exports = {
    authenticateJWT,
    isLoggedIn,
    ensureAdmin,
    isCorrectUserOrAdmin,
};
