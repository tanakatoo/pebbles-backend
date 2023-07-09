"use strict";

describe("config can come from env", function () {
    test("works", function () {
        // process.env.SECRET_KEY = "abc";
        // process.env.PORT = "5000";
        // process.env.DATABASE_URL = "other";
        // process.env.NODE_ENV = "other";

        const config = require("./config");
        console.log(config)
        expect(config.SECRET_KEY).toEqual("secret-dev");
        expect(config.PORT).toEqual(3001);
        console.log('this is db url', config.getDatabaseUri())
        expect(config.getDatabaseUri()).toEqual("postgresql:///pebbles");
        expect(config.BCRYPT_WORK_FACTOR).toEqual(12);

        // delete process.env.SECRET_KEY;
        // delete process.env.PORT;
        // delete process.env.BCRYPT_WORK_FACTOR;
        // delete process.env.DATABASE_URL;
        // process.env.NODE_ENV = "test";
        // console.log('this is db url', config.getDatabaseUri())
        // expect(config.getDatabaseUri()).toEqual("postgresql:///pebbles");
        process.env.NODE_ENV = "test";

        expect(config.getDatabaseUri()).toEqual("postgresql:///pebbles_test");
    });
})

