const express = require('express');
const router = express.Router();
const { formData } = require("../config/functions.js");
const { apiData } = require("../config/functions.js");
const { retriveCoordinates } = require("../config/functions.js");
const { retriveCity } = require("../config/functions.js");
const { getMyLatLng } = require("../config/functions.js");
const querystring = require('querystring');
const url = require('url');


router.get('/', async(req, res) => {
    const userCoordinates = await retriveCoordinates(res).catch(err => { console.log(err) });

    const lat = userCoordinates.location.lat.toString();
    const lng = userCoordinates.location.lng.toString();
    let error = "";
    if (req.query.error) {
        error += req.query.error;
    }

    try {
        const response = await retriveCity(res, lat, lng);

        res.render('index', {
            title: 'Home',
            error: error,
            townName: response.town.toString(),
            weatherDesc: response.fullAddress,
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
    const userTownCoordinates = await getMyLatLng(res, storeFormData);
    const userLatLng = userTownCoordinates.results[0].geometry.location;
    const userCoordinates = await retriveCoordinates(res).catch(err => { console.log(err) });
    const lat = userCoordinates.location.lat.toString();
    const lng = userCoordinates.location.lng.toString();

    res.locals.path = req.path;
    await apiData(res, storeFormData).then(response => {
        res.render('results', {
            title: 'Results',
            townName: response.name,
            weatherDesc: response.desc,
            temp: response.temperature.toFixed(0),
            main: response.mainDesc,
            lat: userLatLng.lat,
            lng: userLatLng.lng,
            currentLat: lat,
            currentLng: lng
        });
    }).catch((err) => {
        res.statusCode = err.response;
        const query = err.message;
        res.redirect('/?error=' + err.message);
    });

    res.end();
});

router.get('/results', (req, res) => {
    res.render('results');
    res.end();
})



module.exports = router;