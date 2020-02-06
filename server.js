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
app.use(express.json());

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
});

app.get('/api/shorturl/', function (req, res) {
    console.log('redirect after fetching the url from the db');
});

app.post('/api/shorturl/new', function (req, res) {
    console.log(req.body);

    const urlToShorten = req.body.url;
    const isUrlValid = validateUrl(urlToShorten);
    const shortUrl = shortPassedUrl(urlToShorten);

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
    return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(url);
}

function shortPassedUrl(url) {
    return 2;
}