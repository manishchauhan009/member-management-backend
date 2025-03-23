const express = require('express');
const router = express.Router();
const { Country, State, City } = require('../models/locationSchema');

router.get('/countries', async (req, res) => {
    try {
        const countries = await Country.find(); 
        res.json(countries);
    } catch (err) {
        console.error("Error fetching countries:", err);
        res.status(500).json({ error: "Error fetching countries." });
    }
});


router.get('/states/:countryId', async (req, res) => {
    try {
        const { countryId } = req.params;
        const states = await State.find({ country: countryId }); 
        res.json(states);
    } catch (err) {
        console.error("Error fetching states:", err);
        res.status(500).json({ error: "Error fetching states." });
    }
});

router.get('/cities/:stateId', async (req, res) => {
    try {
        const { stateId } = req.params;
        const cities = await City.find({ state: stateId }); 
        res.json(cities);
    } catch (err) {
        console.error("Error fetching cities:", err);
        res.status(500).json({ error: "Error fetching cities." });
    }
});

module.exports = router;
