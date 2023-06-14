const express = require('express')
const jsonschema = require('jsonschema')
const router = express.Router();
const locationSchema = require("../schemas/location.json")
const saveLocationSchema = require("../schemas/saveLocation.json")
const { BadRequestError, UnauthorizedError } = require("../error")
const axios = require('axios')
const { Client } = require('@googlemaps/google-maps-services-js');


const client = new Client();


router.get('/location', async (req, res, next) => {

    try {
        const validator = jsonschema.validate(req.query, locationSchema)
        if (!validator.valid) {

            const errs = validator.errors.map(e => e.stack)
            throw new BadRequestError(errs)
        }

        const { q, lang, sessionToken } = req.query
        console.log('sessiontoken for locaton query', sessionToken)
        const result = await client.placeAutocomplete({
            params: {
                input: q,
                language: lang,
                types: '(regions)',
                key: process.env.GOOGLE_API_KEY,
                sessiontoken: sessionToken
            },
            timeout: 1000 // Optional timeout value in milliseconds
        });
        let resultToReturn = []

        //some locations do not have types, so we have to check if there are "types" associated with the location
        result.data.predictions.map(d => {
            if (d.types && (d.types.find(ele => ele == 'locality' || ele == 'country' || ele == 'administrative_area_level_1')))
                resultToReturn.push({ description: d.description, place_id: d.place_id })
        })

        return res.status(201).json(resultToReturn)
    } catch (e) {
        return next(e)
    }
});

router.get('/select-location', async (req, res, next) => {
    try {
        const validator = jsonschema.validate(req.query, saveLocationSchema)
        if (!validator.valid) {

            const errs = validator.errors.map(e => e.stack)
            throw new BadRequestError(errs)
        }
        const { id, sessionToken } = req.query
        console.log('session token for the first query', sessionToken)
        // const resultEN = await axios.get(`https://maps.googleapis.com/maps/api/place/details/json?placeid=${id}&fields=address_component&language=EN&key=${process.env.GOOGLE_API_KEY}`)
        // const resultJA = await axios.get(`https://maps.googleapis.com/maps/api/place/details/json?placeid=${id}&fields=address_component&language=JA&key=${process.env.GOOGLE_API_KEY}`)
        const resultEN = await client.placeDetails({
            params: {
                place_id: id,
                fields: 'address_component',
                language: 'en',
                sessiontoken: sessionToken,
                key: process.env.GOOGLE_API_KEY
            },
            timeout: 1000 // Optional timeout value in milliseconds
        });
        const resultJA = await client.placeDetails({
            params: {
                place_id: id,
                fields: 'address_component',
                language: 'ja',
                key: process.env.GOOGLE_API_KEY
            },
            timeout: 1000 // Optional timeout value in milliseconds
        });
        //parse and return full names of location in both languages
        console.log(resultEN.data.result, resultJA.data.result)
        let city
        let state
        let country
        let city_ja
        let state_ja
        let country_ja
        resultEN.data.result.address_components.map(l => {
            if (l.types.find(ele => ele == 'locality')) {
                //if locality is the type then
                console.log(l.long_name)
                city = l.long_name
            } else if (l.types.find(ele => ele == 'administrative_area_level_1')) {
                console.log(l.long_name)
                state = l.long_name
            } else if (l.types.find(ele => ele == 'country')) {
                console.log(l.long_name)
                country = l.long_name
            }
        })
        resultJA.data.result.address_components.map(l => {
            if (l.types.find(ele => ele == 'locality')) {
                //if locality is the type then
                console.log(l.long_name)
                city_ja = l.long_name
            } else if (l.types.find(ele => ele == 'administrative_area_level_1')) {
                console.log(l.long_name)
                state_ja = l.long_name
            } else if (l.types.find(ele => ele == 'country')) {
                console.log(l.long_name)
                country_ja = l.long_name
            }
        })

        return res.status(201).json({
            EN: {
                city: city,
                state: state,
                country: country
            },
            JA: {
                city: city_ja,
                state: state_ja,
                country: country_ja
            }
        })
    } catch (e) {
        return next(e)
    }
})
//get places id and get full address to save 
//https://maps.googleapis.com/maps/api/place/details/json?placeid=ChIJsU7_xMfKQ4gReI89RJn0-RQ&fields=address_component&language=JA&key=

module.exports = router;