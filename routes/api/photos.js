const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

const key = '00ac5f70d662304b87e7da585bbdef9d';

/** 
 *  Creates a route, that gets JSON from flicker API and sends it as a response, when there is a get 
 *  request to localhost:5000/api/photos.
 */
router.get('/:page', (req, res) => {
    console.log(`Page loaded ${req.params.page}`);
    console.log('GET Request at localhost:5000/api/photos... initialize router.get()');

    let url = `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${key}&tags=nyc&per_page=5&page=${req.params.page}&format=json&nojsoncallback=1`;

    fetch(url)
        .then(response => response.json())
        .then(json => res.send(json.photos.photo))
});

module.exports = router;
