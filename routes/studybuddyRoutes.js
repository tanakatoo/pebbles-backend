const express = require('express')
const router = new express.Router()
const { authenticateJWT, isMustBeLoggedIn, isMustBeCorrectUserOrAdmin } = require("../middleware/auth")
const Studybuddy = require('../models/studybuddyModel')



/**implementing
 * filters study buddies according to the filter criteria, in no specific order, 30 at a time
 * no authentication required
 * 
 * http://localhost:3001/study-buddies/search?page=1&word=&language_level=&gender=&timezone=&age=18-25
 * returns [{study buddy properties}]
 */
router.get('/search', authenticateJWT, async (req, res, next) => {
    try {

        const { page, word, language_level, gender, timezone, age, type, native_lang, learning_lang } = req.query



        const result = await Studybuddy.searchList(page, word, language_level, gender, timezone, age, type, native_lang, learning_lang)
        return res.status(200).json(result)

    } catch (e) {
        console.log('in search study buddy routes,', e)
        return next(e)
    }
})


/** works
 * gets list of study buddies that are active ordered by activate date, 30 at a time
 * no authentication required
 * 
 * returns [{study buddy properties}] 
 */
router.get('/:page', async (req, res, next) => {

    try {
        let { page } = req.params;

        const result = await Studybuddy.getList(page);
        return res.status(200).json(result);

    } catch (e) {
        return next(e);
    }
})

module.exports = router;