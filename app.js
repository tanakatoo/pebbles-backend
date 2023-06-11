const express = require("express");
const cors = require("cors");
const ExpressError = require('./error')
const userRoutes = require('./routes/userRoutes')
const authRoutes = require('./routes/authRoutes');
const messageRoutes = require('./routes/messageRoutes')
const locationRoutes = require("./routes/externalApiRoutes")
// const mailchimpTx = require("@mailchimp/mailchimp_transactional")(process.env.MAILCHIMP_API_KEY)
const app = express();
const sendEmail = require('./helpers/emailing')

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/users', userRoutes)
app.use('/auth', authRoutes)
app.use('/external/api', locationRoutes)
app.use('/messages', messageRoutes)

// sendEmail()

//to test connection to email server
// async function run() {
//     const response = await mailchimpTx.users.ping();
//     console.log(response);
// }

// run();

app.get('./favicon.ico', (req, res) => {
    res.sendStatus(204)
})

//this is the 404, so this is hit if none of the other routes are hit
app.use((req, res, next) => {
    const e = new ExpressError.NotFoundError()
    next(e)
})

//this catches the error that we made with our custom ExpressError or a generic error and sends it back
app.use(function (err, req, res, next) {
    if (process.env.NODE_ENV !== "test") console.error(err.stack);
    const status = err.status || 500;
    const message = err.message;

    return res.status(status).json({
        error: { message, status },
    });
});

module.exports = app