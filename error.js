class ExpressError extends Error {
    constructor(msg, status) {
        super();
        this.message = msg
        this.status = status;
        console.log(this.stack)
    }
}


/** 404 NOT FOUND error. */

class NotFoundError extends ExpressError {
    constructor(message = "NOT_FOUND") {
        super(message, 404);
    }
}

/** 401 UNAUTHORIZED error. */

class UnauthorizedError extends ExpressError {
    constructor(message = "UNAUTHORIZED") {
        super(message, 401);
    }
}

/** 400 BAD REQUEST error. */

class BadRequestError extends ExpressError {
    constructor(message = "BAD_REQUEST") {
        super(message, 400);
    }
}

/** 403 BAD REQUEST error. */

class ForbiddenError extends ExpressError {
    constructor(message = "FORBIDDEN") {
        super(message, 403);
    }
}

module.exports = {
    ExpressError,
    NotFoundError,
    UnauthorizedError,
    BadRequestError,
    ForbiddenError,
};
