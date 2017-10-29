var request = require('request');
var twitter = require('twitter');
var spotify = require('node-spotify-api');
var fileSystem = require('fs');
var keys = require('./keys');

var commandMap = {
    'my-tweets': 'tweets',
    'spotify-this-song': 'spotify',
    'movie-this': 'OMDB',
    'do-what-it-says': 'storedAction'
}

var app = {
    commandMap: {
        'my-tweets': 'tweets',
        'spotify-this-song': 'spotify',
        'movie-this': 'OMDB',
        'do-what-it-says': 'storedAction',
        '-help': 'help',
        '--help': 'help',
        '-h': 'help',
        '--h': 'help'
    },
    command: process.argv[2],
    nameValue: process.argv[3],
    tweets: function() {
        console.log("TWEETS!");
    },
    spotify: function() {
        console.log("SPOTIFY!");
    },
    OMDB: function() {
        var movieData;
        this.requestData(this.buildUri(), function(res) {
            movieData = res;
            app.displayMovieInfo(movieData);
        });
    },
    buildUri: function() {
        if (this.nameValue === undefined) {
            console.log("\n\nYou have not supplied a name value for this command!\n\nTry <node liri.js -help> for information on using this app.");
            process.exit();
        } 
        else {
            return 'http://www.omdbapi.com/?apikey=40e9cece&t=' + this.nameValue;
        }
    },
    displayMovieInfo: function(movie) {
        console.log("\n\nMovie Title: " + movie.Title);
        console.log("Release Year: " + movie.Year);
        console.log("IMBD Rating: " + movie.Ratings[0].Value);
        console.log("Rotten Tomatoes Rating: " + movie.Ratings[1].Value);
        console.log("Country of production: " + movie.Country);
        console.log("Languages: " + movie.Language);
        console.log("Plot: " + movie.Plot);
        console.log("Actors: " + movie.Actors);
    },
    storedAction: function() {
        console.log("I DON'T GET IT");
    },
    help: function() {
        console.log("HELP ON USING THIS APP!");
    },
    requestData: function(uri, callback) {
        request(uri, function(err, response, body) {
            if (err) {
                console.error(err);
            }
            else if (response.statusCode === 200) {
                callback(JSON.parse(body));
            }
        })
    }
}

if (app.command === undefined) console.log("\n\nYou have not specified a command!\n\nTry <node liri.js -help> for information on using this app.");
else if (app.commandMap[app.command] === undefined) console.log("\n\n" + app.command + " is not a valid command!\n\nTry <node liri.js -help> for information on using this app.");
else app[app.commandMap[app.command]]();