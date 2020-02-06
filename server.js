'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');

var cors = require('cors');

var app = express();

// Basic Configuration 
var port = process.env.PORT || 8000;

/** this project needs a db !! **/
// mongoose.connect(process.env.MONGOLAB_URI);

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
});

app.post("/api/shorturl/new", function (req, res) {
    console.log(req);

    const urlToShorten = req.body.url;
    const isUrlValid = validateUrl(urlToShorten);
    const shortUrl = shortUrl(urlToShorten);

    if (!isUrlValid) {
        res.json({ error: 'invalid Hostname' })
    } else {
        res.json({ 'original_url': urlToShorten, 'short_url': 2 });
    }
});

app.listen(port, function () {
    console.log(`Listening to requests on http://localhost:${port}`);
});

function validateUrl(url) {
    return false;
}

function shortUrl(url) {
    return 2;
}