const express = require('express')
const router = new express.Router()


// const USERS = [
//     { id: 1, username: "test1", firstName: "Hello", lastName: "World" },
//     { id: 2, username: "test2", firstName: "Bye", lastName: "Galaxy" }
// ]
/*
registers new user
parameters: 
*/

router.post('/register', (req, res) => {

    // res.json({ users: USERS })
})

module.exports = router;