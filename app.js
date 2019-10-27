const express = require('express');
const router = require(__dirname + "/routes/routes.js");
const app = express();

// serve static files from /public
app.use(express.static(__dirname + '/src'));

// view engine setup
app.set('view engine', 'pug');
app.set('views', __dirname + "/src/html");

app.use('/', router);

app.use((req, res, next) => {
    const err = new Error("Not Found");
    err.status = 400;
    next(err);
});

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        error: {
            message: err.message,
            status: err.status
        }
    });
});


const hostname = '127.0.0.1';
const port = 3000;

app.listen(port, hostname, () => console.log(`Example app listening on port ${port}!`));