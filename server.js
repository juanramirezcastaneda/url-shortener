'use strict';

require('dotenv').config();
var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var cors = require('cors');
var app = express();

// Basic Configuration 
var port = process.env.PORT || 8000;

mongoose.connect(process.env.MONGOLAB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

var Schema = mongoose.Schema;

var urlSchema = new Schema({
    origin: { type: String, required: true },
    seq: { type: Number, required: true }
});

var ShortenUrl = new mongoose.model("Url-Shorten", urlSchema);

var createAndSaveAUrl = async function (origin) {
    const result = await ShortenUrl.findOne().sort({ seq: -1 })

    const newShortenUrl = !!!result ? new ShortenUrl({ origin: origin, seq: 1 }) :
        new ShortenUrl({ origin: origin, seq: result.seq + 1 });

    try {
        const shortenUrl = await newShortenUrl.save();
        return shortenUrl;
    } catch (error) {
        return null;
    }
};

app.use(cors());
app.use(express.json());

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
});

app.get('/api/shorturl/:short_url', async function (req, res) {
    const url = await ShortenUrl.findOne({ seq: req.params.short_url }).sort({ seq: -1 });
    return res.json({ origin: url.origin });
});

app.post('/api/shorturl/new', async function (req, res, _next) {
    const urlToShorten = req.body.url;
    const isUrlValid = validateUrl(urlToShorten);
    const shortUrl = await createAndSaveAUrl(urlToShorten);

    if (!isUrlValid) {
        res.json({ error: 'invalid Hostname' })
    } else {
        res.json({ 'original_url': shortUrl.origin, 'short_url': shortUrl.seq });
    }
});

app.listen(port, function () {
    console.log(`Listening to requests on http://localhost:${port}`);
});

function validateUrl(url) {
    return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(url);
}