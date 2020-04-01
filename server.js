// Add dotenv which lets us set a local token
// require the dotenv component
require('dotenv').config()

const express = require('express');
const morgan = require('morgan');

// needs cors to make request to another port
const cors = require('cors')
// need helmet for not showing we're using Express
const helmet = require('helmet')
const MOVIES = require('./movies-data-small.json')

const app = express();

app.use(
    morgan('dev'),
    cors(),
    helmet(),
    );

// the app should use the function vBT to make sure
// the requester has a valid token
// the third argument is to go to the next function
app.use(function validateBearerToken(req,res,next) {
    // set the local api token
    const apiToken = process.env.API_TOKEN
    // set the user submitted api token
    const authToken = req.get('Authorization')
    // if the user doesn't submit an api token
    // or if the user and local api token don't match ...
    if (!authToken || authToken.split(' ')[1] !== apiToken) {
        // ... return a 401 unauthorized request
        return res.status(401).json({error: 'Unauthorized request'})
    }
    // if it matches, let's go ahead
    console.log('tokens match!')
    next()
})

// set an endpoint movie and run the func hGM with the
// provided queries
app.get('/movie', function handleGetMovie(req,res) {
    // the response is going to start with the movies array
    let response = MOVIES;
    // if the query provided is a genre ...
    if (req.query.genre) {
        // ...get the movie that matches the user provided genre
        response = response.filter(movie =>
            // normalize the genre to lower case
            movie.genre.toLowerCase().includes(req.query.genre.toLowerCase())
        )
    }
    // if the average vote query is provided then ...
    if (req.query.avg_vote) {
        // ... set the response var to get the movie 
        response = response.filter(movie => 
        // get the movie that's more the submitted rating
        Number(movie.avg_vote) >= Number(req.query.avg_vote)
        )
    }
    // now put the result into json format
    res.json(response)
})

const PORT = 8000;

app.listen(PORT, () => {
    console.log(`Server started on ${PORT}`)
})
