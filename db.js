const { Client } = require("pg")
const pg = require("pg")
const { getDatabaseUri } = require("./config");

//this is used to change incoming timestamp data to a normal string
//otherwise it will change to js date object and converts it to local time
//this will ensure moment will be using the date/time from the db as is
const types = pg.types;
types.setTypeParser(1114, function (stringValue) {
    return stringValue;
});

let db
if (process.env.NODE_ENV === "production") {
    db = new Client({
        connectionString: getDatabaseUri(),
        ssl: {
            rejectUnauthorized: false
        }
    });

} else {
    db = new Client({
        connectionString: getDatabaseUri()
    });
}

db.connect();

module.exports = db;