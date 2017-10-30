#!/usr/bin/env node
/**
 * LiriJS is a language interpretation and recognition interface. It is used in the command line
 * to display information about movies, songs, and recent tweets. This file is where the core
 * logic of the application is located. User input is gathered from the command line to determine
 * what information to request from the APIs that are used by LiriJS. LiriJS makes use of the
 * OMDB API, the Spotify API, and the Twitter API. LiriJS was built with friendly user interaction
 * in mind. From v1.0.0 the application includes a help command that displays all important
 * command information to the user.
 * 
 * @summary All logic for LiriJS is included in this single file.
 * @since 1.0.0
 * @version 1.0.0
 * 
 * Twitter npm module
 * @link https://www.npmjs.com/package/twitter
 * Spotify npm module
 * @link https://www.npmjs.com/package/node-spotify-api
 * Request npm module
 * @link https://www.npmjs.com/package/request
 * Dot-env npm module
 * @link https://www.npmjs.com/package/dot-env
 * 
 * @author Aaron Michael McNulty
 */
// Include depended files and libraries.
var request = require('request');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
require('dotenv').config();
var pjson = require('./package.json');
var fileSystem = require('fs');
var keys = require('./keys');
/**
 * The app object contains all the properties and methods associated with the functionality
 * of the application.
 * 
 * @since 1.0.0
 */
var app = {
    /**
     * A map of commands and their associated methods.
     * 
     * @since 1.0.0
     * @type {Object}
     */
    commandMap: {
        'my-tweets': 'tweets',
        'spotify-this-song': 'spotify',
        'movie-this': 'OMDB',
        'do-what-it-says': 'storedAction',
        '-help': 'help',
        '--help': 'help',
        '-h': 'help',
        '--h': 'help',
        '-v': 'version',
        '--version': 'version'
    },
    /** 
     * The command gathered from the user. 
     * @type {String}
     */
    command: process.argv[2],
    /**
     * The name information gathered from the user for the movie or song query.
     * @type {String}
     */
    nameValue: undefined,
    /**
     * The current build version of LiriJS.
     * @type {String}
     */
    versionNumber: pjson.version,
    /**
     * The id and secret for accessing the Spotify API. This object is needed to use the
     * node-spotify-api npm module.
     * @type {Object}
     */
    spotifyHandle: new Spotify({
        id: '3565b51d290b4bb0aef69db85339f008',
        secret: '633e4f9812c44865bc39e476c13fabcc'
    }),
    /**
     * The consumer and access keys and secrets for accessing the Twitter API. This object
     * is needed to use the twitter npm module.
     * @type {Object}
     */
    twitterHandle: new Twitter({
        consumer_key: keys.consumer_key,
        consumer_secret: keys.consumer_secret,
        access_token_key: keys.access_token_key,
        access_token_secret: keys.access_token_secret
    }),
    /**
     * Executed by the my-tweets command. Queries the twitter api and calls the
     * displayTweets method.
     * 
     * @since 1.0.0
     * @fires app.displayTweets
     */
    tweets: function() {
        var params = {
            exclude_replies: true,
            count: 500,
            include_rts: 1,
            user_id: 'amcnulty88'
        }
        this.twitterHandle.get('statuses/user_timeline', params, function(err, tweets, response) {
            if (err) {
                console.error(err);
            }
            app.displayTweets(tweets.splice(0,20));
        });
    },
    /**
     * Displays the tweets to the console and appends the log.txt file with the information.
     * 
     * @since 1.0.0
     * @param tweets {JSON[]} - Array of twenty tweets from the twitter api.
     */
    displayTweets: function(tweets) {
        for (var i = 0; i < tweets.length; i++) {
            var tweetString = tweets[i].text;
            tweetString = app.tweetFormatter(tweetString);
            var output = "\n-------------------------------------------------------------------------------------------------\n  Tweet:\t" + tweetString + "\n\n  Created on:\t" + tweets[i].created_at + "\n\n-------------------------------------------------------------------------------------------------";
            console.log(output);
            fileSystem.appendFile(process.env.LOG_PATH || "log.txt", output, function(err) {
                if (err) {
                    console.error(err);
                }
            });
        }
    },
    /**
     * Formats a string by adding a new line at no further than index 80 at the space
     * nearest to and less than index 80.
     * 
     * @since 1.0.0
     * @param tweet {String} - The string to be formatted.
     * @returns {String}
     */
    tweetFormatter: function(tweet) {
        for (var i = 80; i > 0; i--) {
            if (tweet.charAt(i) === ' ') {
                var firstHalf = tweet.substring(0, i + 1);
                var secondHalf = tweet.substring(i + 1, tweet.length);
                firstHalf += '\n\t\t';
                return firstHalf + secondHalf;
            }
        }
    },
    /**
     * Executed by the spotify-this-song command. Queries the spotify API then calls
     * the displaySongInfo method.
     * 
     * @since 1.0.0
     * @fires app.displaySongInfo()
     */
    spotify: function() {
        var searchObj = {
            type: 'track',
            query: this.nameValue === '' ? 'The Sign Ace of Base' : this.nameValue,
            limit: 1
        };
        this.spotifyHandle.search(searchObj, function(err, data) {
            if (err) {
                console.error(err);
            }
            app.displaySongInfo(data);
        })
    },
    /**
     * Displays the song info to the console and to the log.txt file.
     * 
     * @param song {JSON} - Song data from the Spotify API
     */
    displaySongInfo: function(song) {
        try {
            appendFileWithData("\n\nArtist: ", song.tracks.items[0].artists[0].name);
            printToConsole("\n\nArtist: ", song.tracks.items[0].artists[0].name);
        }
        catch (e) {
            console.log(e);
            appendFileNoData("\n\nArtist: n/a");
            printToConsole("\n\nArtist: n/a", '');
        }
        try {
            appendFileWithData("Song Title: ", song.tracks.items[0].name);
            printToConsole("Song Title: ", song.tracks.items[0].name);
        }
        catch (e) {
            appendFileNoData("Song Title: n/a");
            printToConsole("Song Title: n/a", '');
        }
        try {
            appendFileWithData("Preview URL: ", song.tracks.items[0].preview_url);
            printToConsole("Preview URL: ", song.tracks.items[0].preview_url);
        }
        catch (e) {
            appendFileNoData("Preview URL: n/a");
            printToConsole("Preview URL: n/a", '');
        }
        
        try {
            appendFileWithData("Album Name: ", song.tracks.items[0].album.name);
            printToConsole("Album Name: ", song.tracks.items[0].album.name);
        }
        catch (e) {
            appendFileNoData("Album Name: n/a");
            printToConsole("Album Name: n/a", '');
        }
        function printToConsole(label, data) {
            console.log(label + data);
        }
        function appendFileNoData(label) {
            fileSystem.appendFile(process.env.LOG_PATH || "log.txt", "\n" + label, function(err) {
                if (err) {
                    console.error(err);
                }
            });
        }
        function appendFileWithData(label, data) {
            fileSystem.appendFile(process.env.LOG_PATH || "log.txt", "\n" + label + data, function(err) {
                if (err) {
                    console.error(err);
                }
            });
        }
    },
    OMDB: function() {
        var movieData;
        this.requestData(this.buildUri(), function(res) {
            movieData = res;
            app.displayMovieInfo(movieData);
        });
    },
    buildUri: function() {
        if (this.nameValue === '') {
            console.log("\n\nYou have not supplied a name value for this command!\n\nTry <node liri.js -help> for information on using this app.");
            process.exit();
        } 
        else {
            return 'http://www.omdbapi.com/?apikey=40e9cece&t=' + this.nameValue;
        }
    },
    displayMovieInfo: function(movie) {
        try {
            console.log("\n\nMovie Title: " + movie.Title);
            fileSystem.appendFile(process.env.LOG_PATH || "log.txt", "\n\nMovie Title: " + movie.Title, function(err) {
                if (err) {
                    console.error(err);
                }
            });
        }
        catch (e) {
            console.log("\n\nMovie Title: n/a");
            fileSystem.appendFile(process.env.LOG_PATH || "log.txt", "\n\nMovie Title: n/a", function(err) {
                if (err) {
                    console.error(err);
                }
            });
        }
        try {
            console.log("Release Year: " + movie.Year);
            fileSystem.appendFile(process.env.LOG_PATH || "log.txt", "\nRelease Year: " + movie.Year, function(err) {
                if (err) {
                    console.error(err);
                }
            });
        }
        catch (e) {
            console.log("Release Year: n/a");
            fileSystem.appendFile(process.env.LOG_PATH || "log.txt", "\nRelease Year: n/a", function(err) {
                if (err) {
                    console.error(err);
                }
            });
        }
        try {
            console.log("IMDB Rating: " + movie.Ratings[0].Value);
            fileSystem.appendFile(process.env.LOG_PATH || "log.txt", "\nIMDB Rating: " + movie.Ratings[0].Value, function(err) {
                if (err) {
                    console.error(err);
                }
            });
        }
        catch (e) {
            console.log("IMDB Rating: n/a");
            fileSystem.appendFile(process.env.LOG_PATH || "log.txt", "\nIMDB Rating: n/a", function(err) {
                if (err) {
                    console.error(err);
                }
            });
        }
        try {
            console.log("Rotten Tomatoes Rating: " + movie.Ratings[1].Value);
            fileSystem.appendFile(process.env.LOG_PATH || "log.txt", "\nRotten Tomatoes Rating: " + movie.Ratings[1].Value, function(err) {
                if (err) {
                    console.error(err);
                }
            });
        }
        catch (e) {
            console.log("Rotten Tomatoes Rating: n/a");
            fileSystem.appendFile(process.env.LOG_PATH || "log.txt", "\nRotten Tomatoes Rating: n/a", function(err) {
                if (err) {
                    console.error(err);
                }
            });
        }
        try {
            console.log("Country of production: " + movie.Country);
            fileSystem.appendFile(process.env.LOG_PATH || "log.txt", "\nCountry of production: " + movie.Country, function(err) {
                if (err) {
                    console.error(err);
                }
            });
        }
        catch (e) {
            console.log("Country of production: n/a");
            fileSystem.appendFile(process.env.LOG_PATH || "log.txt", "\nCountry of production: n/a", function(err) {
                if (err) {
                    console.error(err);
                }
            });
        }
        try {
            console.log("Languages: " + movie.Language);
            fileSystem.appendFile(process.env.LOG_PATH || "log.txt", "\nLanguages: " + movie.Language, function(err) {
                if (err) {
                    console.error(err);
                }
            });
        }
        catch (e) {
            console.log("Languages: n/a");
            fileSystem.appendFile(process.env.LOG_PATH || "log.txt", "\nLanguages: n/a", function(err) {
                if (err) {
                    console.error(err);
                }
            });
        }
        try {
            console.log("Plot: " + movie.Plot);
            fileSystem.appendFile(process.env.LOG_PATH || "log.txt", "\nPlot: " + movie.Plot, function(err) {
                if (err) {
                    console.error(err);
                }
            });
        }
        catch (e) {
            console.log("Plot: n/a");
            fileSystem.appendFile(process.env.LOG_PATH || "log.txt", "\nPlot: n/a", function(err) {
                if (err) {
                    console.error(err);
                }
            });
        }
        try {
            console.log("Actors: " + movie.Actors);
            fileSystem.appendFile(process.env.LOG_PATH || "log.txt", "\nActors: " + movie.Actors, function(err) {
                if (err) {
                    console.error(err);
                }
            });
        }
        catch (e) {
            console.log("Actors: n/a");
            fileSystem.appendFile(process.env.LOG_PATH || "log.txt", "\nActors: n/a", function(err) {
                if (err) {
                    console.error(err);
                }
            });
        }
    },
    storedAction: function() {
        fileSystem.readFile('./random.txt', 'utf8', function(err, data) {
            if (err) {
                console.error(err);
            }
            var commandAndNameArray = data.split(',');
            app.runCommand(commandAndNameArray[0], commandAndNameArray[1]);
        });
    },
    help: function() {
        console.log("\n------------------------------------------------------------------------------------------");
        console.log("  Liri.js is a language interpretation and recognition interface used to gather\n  information about movies, songs, and recent tweets.");
        console.log("------------------------------------------------------------------------------------------");
        console.log("\nUsage: $ node liri.js [command] [name value]");
        console.log("\n\nCommands:");
        console.log("  -h, --h, -help, --help\t\tDisplay help information.");
        console.log("  -v, --version\t\t\t\tDisplays current liri.js version.");
        console.log("  my-tweets\t\t\t\tReturns last twenty tweets from Aaron Michael McNulty.");
        console.log("  spotify-this-song [name value]\tReturns song information for provided name value.");
        console.log("  movie-this [name value]\t\tReturns movie information for provided name value.");
        console.log("  do-what-it-says\t\t\tRuns the command that is stored in random.txt");
    },
    version: function() {
        console.log("\n  Liri.js v" + this.versionNumber);
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
    },
    runCommand: function(command, value) {
        app.nameValue = value;
        app[app.commandMap[command]]();
    }
}

if (app.command === undefined) console.log("\n\nYou have not specified a command!\n\nTry <node liri.js -help> for information on using this app.");
else if (app.commandMap[app.command] === undefined) console.log("\n\n" + app.command + " is not a valid command!\n\nTry <node liri.js -help> for information on using this app.");
else app.runCommand(app.command, process.argv.splice(3, process.argv.length).join(" "));