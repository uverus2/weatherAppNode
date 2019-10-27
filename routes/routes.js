const express = require('express');
const router = express.Router();
const { formData } = require("../config/functions.js");
const { apiData } = require("../config/functions.js");
const { retriveCoordinates } = require("../config/functions.js");
const { retriveCity } = require("../config/functions.js");
const path = require("path");


router.get('/', async(req, res) => {
    const userCoordinates = await retriveCoordinates(res).catch(err => { console.log(err) });

    const lat = userCoordinates.location.lat.toString();
    const lng = userCoordinates.location.lng.toString();
    try {
        const response = await retriveCity(res, lat, lng);
        res.render('index', {
            title: 'Home',
            townName: response.town.toString(),
            weatherDesc: response.fullAddress()
        });
        res.end();
    } catch (err) {
        res.render('index', {
            title: 'Home',
            error: err.message
        });
    }
});

router.post('/results', async(req, res) => {
    const storeFormData = await formData(req);

    await apiData(res, storeFormData).then(response => {
        res.render('results', {
            title: 'Results',
            townName: response.name,
            weatherDesc: response.desc,
            temp: response.temperature.toFixed(0),
            main: response.mainDesc
        });
    }).catch((err) => {
        res.statusCode = err.response;
        res.write(err.message);
    });
    res.end();
});



module.exports = router;