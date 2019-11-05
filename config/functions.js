const { parse } = require('querystring');
const http = require("http");
const https = require("https");
const apiKey = require("./apiKey.json");
const request = require('request');

// Retrive response from forms
const retriveResponseOfForm = (req) => {
    let body = "";
    return new Promise((resolve, reject) => {
        req.on('data', (chunk) => {
            if (chunk) {
                body += chunk.toString();
                const see = parse(body);
                resolve(see.result);
            } else {
                reject();
            }

        });
    });
};

const locateMe = (res) => {
    const url = `${apiKey.geoLocation.url}` + `${apiKey.geoLocation.key}`;
    return new Promise((resolve, reject) => {
        request({
            url: url,
            method: "POST",
            port: 443,
            json: true,
        }, (error, res, body) => {
            if (!error) {
                resolve(res.body);
            } else {
                reject(error);
            }
        });
    });
};

const getMyLatLng = (res, city) => {
    const url = `${apiKey.place.getCoordinates}` + `${city}` + `${apiKey.location.key}`;
    return new Promise((resolve, reject) => {
        request({
            url: url,
            method: "GET",
            json: true,
        }, (error, res, body) => {
            if (!error) {
                resolve(res.body);
            } else {
                reject(error);
            }
        });
    });
};


// const locateMeCity = (res, city) => {
//     const url = `${apiKey.place.places}` + `${city}` + `${apiKey.location.key}`;
//     return new Promise((resolve, reject) => {
//         request({
//             url: url,
//             method: "GET",
//             json: true,
//         }, (error, res, body) => {
//             if (!error) {
//                 resolve(res.body);
//             } else {
//                 reject(error);
//             }
//         });
//     });
// };

// const photoOfLocation = (res, reference) => {
//     const url = `${apiKey.place.photos}` + `${reference}` + `${apiKey.location.key}`;
//     return new Promise((resolve, reject) => {
//         request({
//             url: url,
//             method: "GET",
//             json: true,
//         }, (error, res, body) => {
//             if (!error) {
//                 resolve(res.body);
//             } else {
//                 reject(error);
//             }
//         });
//     });
// };

const retriveCityResponse = (res, lat, lng) => {

    const url = `${apiKey.location.url}` + `${lat},` + `${lng}` + `${apiKey.location.key}`;
    let errorMessage = {};
    return new Promise((resolve, reject) => {

        if (lat && lng) {
            https.get(url, res => {
                let rawData = "";
                if (res.statusCode === 200) {
                    res.on('data', data => {
                        rawData += data;
                    });
                    res.on('end', function() {
                        const parsedData = JSON.parse(rawData);
                        class cityData {
                            constructor(town, fullAddress) {
                                this.town = town.charAt(0).toUpperCase() + town.slice(1);
                                this.fullAddress = fullAddress
                            }
                        }
                        const townName = parsedData.plus_code.compound_code.split(" ")[1].split(",")[0];
                        const results = new cityData(townName, parsedData.results[0].formatted_address);
                        resolve(results);
                    });
                } else {
                    errorMessage = {
                        message: res.statusMessage + "- We cannot locate you Please enter your location below",
                        response: res.statusCode
                    };
                    reject(errorMessage);
                }
            });
        } else {
            errorMessage = {
                message: "Bad Request - We cannot locate you Please enter your location below",
                response: 400
            };
            reject(errorMessage);
        }
    });
};

// Retrive response from weather API 
const retriveAPIResponse = (res, city) => {

    const url = `${apiKey.weatherApi.url}` + `${city}` + `${apiKey.weatherApi.key}`;
    let errorMessage = {};
    return new Promise((resolve, reject) => {
        http.get(url, res => {
            let rawData = "";
            if (res.statusCode === 200) {
                res.on('data', data => {
                    rawData += data.toString();
                    const parsedData = JSON.parse(rawData);
                    class ApiScore {
                        constructor(name, desc, temperature, mainDesc) {
                            this.name = name.charAt(0).toUpperCase() + name.slice(1);
                            this.desc = desc.charAt(0).toUpperCase() + desc.slice(1);
                            this.temperature = temperature;
                            this.mainDesc = mainDesc.charAt(0).toUpperCase() + mainDesc.slice(1);
                        }
                    }
                    const results = new ApiScore(parsedData.name, parsedData.weather[0].description, parsedData.main.temp, parsedData.weather[0].main);
                    resolve(results);
                });
            } else if (res.statusCode === 404) {
                errorMessage = {
                    message: "Your location cannot be found. Try entering something else.",
                    response: res.statusCode
                };
                reject(errorMessage);
            } else {
                errorMessage = {
                    message: res.statusMessage,
                    response: res.statusCode
                };
                reject(errorMessage);
            }


        });
    });
};


module.exports = {
    formData: retriveResponseOfForm,
    apiData: retriveAPIResponse,
    retriveCoordinates: locateMe,
    retriveCity: retriveCityResponse,
    getMyLatLng
};