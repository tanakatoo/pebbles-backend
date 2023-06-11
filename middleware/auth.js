"use strict";

/** Convenience middleware to handle common auth cases in routes. */

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const { UnauthorizedError } = require("../error");
const User = require('../models/userModel')


/** Middleware: Authenticate user.
 *
 * If a token was provided in the header, verify it, and, if valid, store the user info in res.locals.user
 * on res.locals (this will include only user id)
 *
 * It's not an error if no token was provided or if the token is not valid. 
 * It just means user is not logged in
 */

async function authenticateJWT(req, res, next) {
    try {
        const authHeader = req.headers && req.headers.authorization;

        if (authHeader) {
            const token = authHeader.replace(/^[Bb]earer /, "").trim();
            res.locals.user = jwt.verify(token, SECRET_KEY);
            console.log('got token verified, id is', res.locals.user.id)

            const role = await User.getRole(res.locals.user.id)
            res.locals.user.role = role
            console.log('locals user is', res.locals.user)
            req.loggedIn = true //if jwt.verify is correct, it will continue down to this line so we set loggedIn = true

        } else {
            req.loggedIn = false
        }
        return next();
    } catch (err) {
        console.log('caught error', err)
        return next();
    }
}

/** Middleware to use to check if they are logged in
 *
 * Not an error if they are not logged in, it just sets 
 */

// function isLoggedIn(req, res, next) {
//     try {
//         if (!res.locals.user) {
//             req.loggedIn = false

//         } else {
//             req.loggedIn = true
//         }
//         return next();
//     } catch (err) {
//         return next(err);
//     }
// }

/** Middleware to use to check if they are logged in
 *
 * If not, raises Unauthorized.
 */

function isMustBeLoggedIn(req, res, next) {
    try {
        if (!res.locals.user) {
            throw new UnauthorizedError("UNAUTHORIZED");

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

/** Middleware to check if they have a valid token & is user matching
 *  username provided as route param.
 *Adds to the request object whether the logged in user is the correct user to view resource
 */

function isCorrectUserOrAdmin(req, res, next) {
    try {
        const user = res.locals.user;

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

/** Middleware to check if it is user matching
 *  user id in body
 *
 * returns unauthorized if not
 */

function isMustBeCorrectUserOrAdmin(req, res, next) {
    try {
        const user = res.locals.user;
        console.log('req body id is', req.body.id)
        console.log('logged in use rid is', user.id)
        console.log('loggd in user', user)
        if (!(user && (user.role === "admin" || user.id === req.body.id))) {
            throw new UnauthorizedError();

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
    isMustBeLoggedIn,
    ensureAdmin,
    isCorrectUserOrAdmin,
    isMustBeCorrectUserOrAdmin
};
