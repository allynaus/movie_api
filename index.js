const express = require('express');
const app = express();
const morgan = require('morgan');
app.use(express.static('public'));
app.use(morgan('common'));

let topMovies = [
    {
        title: 'Sleeping with Other People',
        director: 'Leslye Headland',
        cast: 'Alison Brie, Jason Sudeikis',
        genre: 'Romance'
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
        title: 'The Help',
        director: 'Tate Taylor',
        cast: 'Viola Davis, Emma Stone',
        genre: 'Drama, Historical Drama'
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
        genre: 'Drama, Romance'
    },
    {
        title: 'American History X',
        director: 'Tony Kaye',
        cast: 'Edward Norton, Edward Furlong',
        genre: 'Indie Film, Drama'
    }
];

// GET requests
app.get('/', (req, res) => {
    res.send('Welcome to myFlix!');
});

app.get('/movies', (req, res) => {
    res.json(topMovies);
});

// listen for requests
app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});

//error handling middleware
app.use((err, req,res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});