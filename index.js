const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://localhost:27017/db', { useNewUrlParser: true, useUnifiedTopology: true});

const express = require('express');
const app = express();
const morgan = require('morgan');
app.use(express.static('public'));
app.use(morgan('common'));

let topMovies = [
    {
        title: 'Sleeping With Other People',
        director: 'Leslye Headland',
        cast: 'Alison Brie, Jason Sudeikis',
        genre: 'Romance, Comedy'
    },
    {
        title: 'LaLaLand',
        director: 'Damien Chazelle',
        cast: 'Emma Stone, Ryan Gosling',
        genre: 'Romance, Musical'
    },
    {
        title: 'The Perks of Being a Wallflower',
        director: 'Stephen Chbosky',
        cast: 'Emma Watson, Logan Lerman',
        genre: 'Romance, Drama'   
    },
    {
        title: 'No Hard Feelings',
        director: 'Gene Stupnitsky',
        cast: 'Jennifer Lawrence, Andrew Barth Feldman',
        genre: 'Comedy, Drama'
    },
    {
        title: 'Love, Rosie',
        director: 'Christian Ditter',
        cast: 'Lily Collins, Sam Claflin',
        genre: 'Romance, Comedy'
    },
    {
        title: 'The Book of Eli',
        director: 'Albert Hughes, Allen Hughes',
        cast: 'Denzel Washington, Gary Oldman',
        genre: 'Action, Sci-Fi'
    },
    {
        title: 'Nobody',
        director: 'Ilya Naishuller',
        cast: 'Bob Odenkirk, Christopher Lloyd',
        genre: 'Action, Thriller'
    },
    {

        title: 'Your Place or Mine',
        director: 'Aline Brosh McKenna',
        cast: 'Reese Witherspoon, Ashton Kutcher',
        genre: 'Romance, Comedy'
    },
    {
        title: 'Little Women',
        director: 'Gillian Armstrong',
        cast: 'Winona Ryder, Christian Bale',
        genre: 'Romance, Drama'
    },
    {
        title: 'American History X',
        director: 'Tony Kaye',
        cast: 'Edward Norton, Edward Furlong',
        genre: 'Indie Film, Drama'
    },
    {
        title: 'How To Be Single',
        director: "Christian Ditter",
        cast: 'Dakota Johnson, Rebel Wilson',
        genre: "Romance, Comedy"
    },
    {
        title: 'The Devil Wears Prada',
        director: 'Aline Brosh McKenna',
        cast: 'Anne Hathaway, Meryl Streep',
        genre: 'Comedy, Drama'
    }
];

// Display index page
app.get('/', (req, res) => {
    res.send('Welcome to myFlix!');
});

//Get a list of movies 
app.get('/movies', (req, res) => {
    res.json(topMovies);
});

//Get titles for list of movies
app.get('/movies/:title', (req, res) => {
    res.send({ Title: req.params.title })
})

//Get Director name, bio, and picture
app.get('/movies/director/:directorName', (req, res) => {
    res.json({'Director.Name': req.params.directorName })
})

//Get Cast members
app.get('/movies/cast/:castName', (req, res) => {
    res.json({ 'Cast.Name': req.params.castName })
})

//Get Genre by Name
app.get('/movies/genres/:genreName', (req, res) => {
    res.json({ 'Genre.Name': req.params.genreName })
})

//error handling middleware
app.use((err, req,res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// listen for requests
app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});