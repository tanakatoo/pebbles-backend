const express = require("express");
const cors = require("cors");
const ExpressError = require('./error')
const userRoutes = require('./routes/userRoutes')
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/users', userRoutes)
app.use('/auth', authRoutes)


app.get('./favicon.ico', (req, res) => {
    res.sendStatus(204)
})

app.use('/', (req, res) => {
    res.send('hello')
}
)

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