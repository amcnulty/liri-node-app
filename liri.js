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
var chalk = require('chalk');
require('dotenv').config();
var pjson = require('./package.json');
var fileSystem = require('fs');
var keys = require('./keys');
// Shorthand for logging to the console.
var log = console.log;
// Color constants to be used by the chalk npm module
var errorColor = chalk.hex('FF0000');
var headingColor = chalk.hex('00FF00');
var labelColor = chalk.hex('FF00FF');
var blue = chalk.hex('0000FF');
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
            tweetString = app.stringFormatter(tweetString, 2);
            var consoleOutput = blue("\n-------------------------------------------------------------------------------------------------\n") + labelColor("  Tweet:\t") + tweetString + labelColor("\n\n  Created on:\t") + tweets[i].created_at + blue("\n\n-------------------------------------------------------------------------------------------------");
            var output = "\n-------------------------------------------------------------------------------------------------\n  Tweet:\t" + tweetString + "\n\n  Created on:\t" + tweets[i].created_at + "\n\n-------------------------------------------------------------------------------------------------";
            log(consoleOutput);
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
     * @param tabs {Number} - The number of tabs to add after the newline is added.
     * @returns {String}
     */
    stringFormatter: function(tweet, tabs) {
        for (var i = 80; i > 0; i--) {
            if (tweet.charAt(i) === ' ') {
                var firstHalf = tweet.substring(0, i + 1);
                var secondHalf = tweet.substring(i + 1, tweet.length);
                firstHalf += '\n';
                for (var i = 0; i < tabs; i++) {
                    firstHalf += '\t';
                }
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
     * Displays the song info to the console and to the log.txt file. If no data is
     * provided from the query n/a is displayed in place of the data.
     * 
     * @since 1.0.0
     * @param song {JSON} - Song data from the Spotify API
     */
    displaySongInfo: function(song) {
        try {
            app.appendFile("\n\nArtist: ", song.tracks.items[0].artists[0].name);
            app.printToConsole("\n\n  Artist:\t\t", song.tracks.items[0].artists[0].name);
        }
        catch (e) {
            app.appendFile("\n\nArtist: ", "n/a");
            app.printToConsole("\n\n  Artist:\t\t", "n/a");
        }
        try {
            app.appendFile("Song Title: ", song.tracks.items[0].name);
            app.printToConsole("  Song Title:\t\t", song.tracks.items[0].name);
        }
        catch (e) {
            app.appendFile("Song Title: ", "n/a");
            app.printToConsole("  Song Title:\t\t", "n/a");
        }
        try {
            app.appendFile("Preview URL: ", song.tracks.items[0].preview_url);
            app.printToConsole("  Preview URL:\t\t", song.tracks.items[0].preview_url);
        }
        catch (e) {
            app.appendFile("Preview URL: ", "n/a");
            app.printToConsole("  Preview URL:\t\t", "n/a");
        }
        
        try {
            app.appendFile("Album Name: ", song.tracks.items[0].album.name);
            app.printToConsole("  Album Name:\t\t", song.tracks.items[0].album.name);
        }
        catch (e) {
            app.appendFile("Album Name: ", "n/a");
            app.printToConsole("  Album Name:\t\t", "n/a");
        }
    },
    /**
     * Logs output to the console with a label and data.
     * 
     * @param {String} label - The label of what the data represents.
     * @param {String} data - The data to be displayed.
     */
    printToConsole: function(label, data) {
        log(labelColor(label) + data);
    },
    /**
     * Logs output to the log.txt file with a label and data.
     * 
     * @param {String} label - The label of what the data represents.
     * @param {String} data - The data to be displayed.
     */
    appendFile(label, data) {
        fileSystem.appendFile(process.env.LOG_PATH || "log.txt", "\n" + label + data, function(err) {
            if (err) {
                console.error(err);
            }
        });
    },
    /**
     * Executed by the movie-this command. Uses the request npm module to request data
     * from the OMDB API. After request has finished this method calls displayMovieInfo.
     * 
     * @since 1.0.0
     * @fires app.buildUri()
     * @fires app.displayMovieInfo()
     */
    OMDB: function() {
        this.requestData(this.buildUri(), function(res) {
            app.displayMovieInfo(res);
        });
    },
    /**
     * Checks if the app.nameValue variable has a string to build a proper URI for
     * querying the OMDB database. If the nameValue is empty an alert is print to the
     * console and the app closes.
     * 
     * @since 1.0.0
     * @returns {String}
     */
    buildUri: function() {
        if (this.nameValue === '') {
            console.log("\n\nYou have not supplied a name value for this command!\n\nTry <node liri.js -help> for information on using this app.");
            process.exit();
        } 
        else {
            return 'http://www.omdbapi.com/?apikey=40e9cece&t=' + this.nameValue;
        }
    },
    /**
     * Displays the movie info to the console and to the log.txt file. If no data is
     * provided from the query n/a is displayed in place of the data.
     * 
     * @since 1.0.0
     * @param movie {JSON} - Data from the OMDB API about the movie to be displayed.
     */
    displayMovieInfo: function(movie) {
        try {
            app.appendFile("\nMovie Title: ", movie.Title);
            app.printToConsole("\n\n  Movie Title:\t\t\t", movie.Title);
        }
        catch (e) {
            app.appendFile("\nMovie Title: ", "n/a");
            app.printToConsole("\n\n  Movie Title:\t\t\t" , "n/a");
        }
        try {
            app.appendFile("Release Year: ", movie.Year);
            app.printToConsole("  Release Year:\t\t\t", movie.Year);
        }
        catch (e) {
            app.appendFile("Release Year: ", "n/a");
            app.printToConsole("  Release Year:\t\t\t", "n/a");
        }
        try {
            app.appendFile("IMDB Rating: ", movie.Ratings[0].Value);
            app.printToConsole("  IMDB Rating:\t\t\t", movie.Ratings[0].Value);
        }
        catch (e) {
            app.appendFile("IMDB Rating: ", "n/a");
            app.printToConsole("  IMDB Rating:\t\t\t", "n/a");
        }
        try {
            app.appendFile("Rotten Tomatoes Rating: ", movie.Ratings[1].Value);
            app.printToConsole("  Rotten Tomatoes Rating:\t", movie.Ratings[1].Value);
        }
        catch (e) {
            app.appendFile("Rotten Tomatoes Rating: ", "n/a");
            app.printToConsole("  Rotten Tomatoes Rating:\t", "n/a");
        }
        try {
            app.appendFile("Country of production: ", movie.Country);
            app.printToConsole("  Country of production:\t", movie.Country);
        }
        catch (e) {
            app.appendFile("Country of production: ", "n/a");
            app.printToConsole("  Country of production:\t", "n/a");
        }
        try {
            app.appendFile("Languages: ", movie.Language);
            app.printToConsole("  Languages:\t\t\t", movie.Language);
        }
        catch (e) {
            app.appendFile("Languages: ", "n/a");
            app.printToConsole("  Languages:\t\t\t", "n/a");
        }
        try {
            app.appendFile("Plot: ", movie.Plot);
            app.printToConsole("  Plot:\t\t\t\t", app.stringFormatter(movie.Plot, 4));
        }
        catch (e) {
            app.appendFile("Plot: ", "n/a");
            app.printToConsole("  Plot:\t\t\t\t", "n/a");
        }
        try {
            app.appendFile("Actors: ", movie.Actors);
            app.printToConsole("  Actors:\t\t\t", movie.Actors);
        }
        catch (e) {
            app.appendFile("Actors: ", "n/a");
            app.printToConsole("  Actors:\t\t\t", "n/a");
        }
    },
    /**
     * Executed by the do-what-it-says command. Runs the command that is in the
     * random.txt file.
     * 
     * @since 1.0.0
     * @fires app.runCommand()
     */
    storedAction: function() {
        fileSystem.readFile('./random.txt', 'utf8', function(err, data) {
            if (err) {
                console.error(errorColor(err));
            }
            var commandAndNameArray = data.split(',');
            try {
                app.runCommand(commandAndNameArray[0], commandAndNameArray[1]);
            }
            catch (e) {
                log(errorColor("\n\n" + commandAndNameArray[0] + " is not a valid command!\n\nTry <node liri.js -help> for information on using this app."));
            }
        });
    },
    /**
     * Executed by the -h, --h, -help, and --help commands. Displays help information
     * to the console about commands and their usage.
     * 
     * @since 1.0.0
     */
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
    /**
     * Executed by the -v and --version commands. Displays the current build version
     * of LiriJS to the console.
     * 
     * @since 1.0.0
     */
    version: function() {
        console.log("\n  Liri.js v" + this.versionNumber);
    },
    /**
     * Generic request function for querying any URI. The response information is returned.
     * 
     * @since 1.0.0
     * @param uri {String} - The URI to send the request to.
     * @param callback {Function} - Called when response is received.
     * @callback A JSON object is passed to the callback containing the response body.
     */
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
    /**
     * Runs a command from the command map.
     * 
     * @since 1.0.0
     * @param command {String} - The command to be run.
     * @param value {String} - The name value associated with the command.
     */
    runCommand: function(command, value) {
        app.nameValue = value;
        app[app.commandMap[command]]();
    }
}
// Checks if user has entered a command and or name value before calling app.runCommand()
if (app.command === undefined) log(errorColor("\n\nYou have not specified a command!\n\nTry <node liri.js -help> for information on using this app."));
else if (app.commandMap[app.command] === undefined) log(errorColor("\n\n" + app.command + " is not a valid command!\n\nTry <node liri.js -help> for information on using this app."));
else app.runCommand(app.command, process.argv.splice(3, process.argv.length).join(" "));