const express = require('express'),
    bodyParser = require('body-parser'),
    morgan = require('morgan');

const app = express();

const mongoose = require('mongoose');
const Models = require('./models');

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect( process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.urlencoded({ extend: false }));
app.use(morgan('common'));
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extend: true }));


const cors = require('cors');
const { check, validationResult } = require('express-validator');

let allowedOrigins = ['http://localhost:8080', 'http://testsite.com', 'http://localhost:1234', 'https://my-flixmovies-2d2c4ce19e0f.herokuapp.com/'];

app.use(cors({
  origin: (origin, callback) => {
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){ // If a specific origin isn’t found on the list of allowed origins
      let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
      return callback(new Error(message ), false);
    }
    return callback(null, true);
  }
}));

let auth = require('./auth') (app);
const passport = require('passport');
require('./passport');

//Read Index Page
app.get('/', (req, res) => {
    res.send('Welcome to myFlix!');
});

//Read User page
app.get('/users', async (req, res) => {
        await Users.find()
        .then((users) => {
            res.status(201).json(users);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
    });

//Get a user by username
app.get('/users/:Username', passport.authenticate("jwt", { session: false }), async (req, res) => {
        // Your code to find user by Username
    await Users.findOne({ Username: req.params.Username })
    .then((user) => {
        res.json(user);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

//Read movie list
app.get('/movies', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Movies.find()
    .then((movies) => {
        res.status(200).json(movies);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

//Read movies by title
app.get('/movies/:Title', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Movies.findOne({ Title: req.params.Title })
    .then((movie) => {
        res.status(200).json(movies);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

//Read Genres by name
app.get('/movies/Genre/:GenreName', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Movies.findOne({ 'Genre.Name': req.params.GenreName })
    .then((movie) => {
     if (movie) {
        res.status(200).json(movie.Genre);
     } else {
        res.status(400).send("Genre not found");
     }
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

//Read directors by name
app.get('/movies/Director/:DirectorName', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Movies.findOne({ 'Director.Name': req.params.DirectorName })
    .then((movie) => {
        res.status(200).json(movie.Director);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

//Add a user
app.post('/users', 
    // Validation logic here for request
    [
        check('Username', 'Username is required').isLength({min: 5}),
        check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
        check('Password', 'Password is required').not().isEmpty(),
        check('Email', 'Email does not appear to be valid').isEmail()
    ], async (req, res) => {
        // check the validation object for errors
        let errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        let hashedPassword = Users.hashPassword(req.body.Password);
        await Users.findOne({ Username: req.body.Username}) // search to see if a user with the requested username already exists
        .then((user) => {
        if (user) {
            return res.status(400).send(req.body.Username + 'already exists');
        } else {
            Users.create({
                    Username: req.body.Username,
                    Password: hashedPassword,
                    Email: req.body.Email,
                    Birthday: req.body.Birthday
                })
                .then((user) =>{res.status(201).json(user) })
                .catch((error) => {
                    console.error(error);
                    res.status(500).send('Error: ' + error);
                })
        }
    })
    .catch((error) => {
        console.error(error);
        res.status(500).send('Error ' + error);
    });
});

//Update a user's info via username
app.put('/users/:Username', passport.authenticate('jwt', { session: false}), async (req, res) => {
    await Users.finOneAndUpdate({ Username: req.params.Username },
        { 
            $set: {
                Username: req.body.Username,
                Password: req.body.Password,
                Email: req.body.Email,
                Birthday: req.body.Birthday
            },
    },
    { new: true}, 
    ) //this line ensures the updated document is returned
        .then((updatedUser) => {
            res.json(updatedUser);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        })
    });

//Add a movie to a user's list of favorites
app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false}), async (req, res) => 
{
    await Users.findOneAndUpdate({ Username: req.params.Username }
        , {
            $push: { FavoriteMovies: req.params.MovieID }
        },
        { new: true }
        ) // this line ensures the updated document is returned
        .then((updatedUser) => {
            res.json(updatedUser);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

//Delete a user via username
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Users.findOneAndDelete({ Username: req.params.Username })
    .then((user) => {
        if (!user) {
            res.status(400).send(req.params.Username + ' was not found.');
        } else {
            res.status(200).send(req.params.Username + ' was not deleted.');
        }
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

//Delete a user's favorite movie
app.delete('/users/:Username/movies/:movieId', passport.authenticate('jwt', { session: false}), async (req, res) => {
    await Users.finOneAndDelete(
        { Username: req.params.Username },
        { $pull: { FavoriteMovies: req.params.MovieId } },
        { new: true },
    )
        .then((updatedUser) => {
            res.json(updatedUser);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

//error handling middleware
app.use((err, req,res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// listen for requests
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
    console.log('Listening on Port ' + port);
});