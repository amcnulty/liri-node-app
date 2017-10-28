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
        console.log("OMDB!!");
    },
    storedAction: function() {
        console.log("I DON'T GET IT");
    },
    help: function() {
        console.log("HELP ON USING THIS APP!");
    }
}

if (app.command === undefined) console.log("\n\nYou have not specified a command!\n\nTry <node liri.js -help> for information on using this app.");
else app[app.commandMap[app.command]]();