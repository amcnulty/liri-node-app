var request = require('request');
var twitter = require('twitter');
var Spotify = require('node-spotify-api');
require('dotenv').config();
var fileSystem = require('fs');
var keys = require('./keys');

// var spotify = new Spotify({
    // id: '3565b51d290b4bb0aef69db85339f008',
    // secret: '633e4f9812c44865bc39e476c13fabcc'
// });

// var commandMap = {
//     'my-tweets': 'tweets',
//     'spotify-this-song': 'spotify',
//     'movie-this': 'OMDB',
//     'do-what-it-says': 'storedAction'
// }

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
    nameValue: undefined,
    spotifyHandle: new Spotify({
        id: '3565b51d290b4bb0aef69db85339f008',
        secret: '633e4f9812c44865bc39e476c13fabcc'
    }),
    tweets: function() {
        console.log("TWEETS!");
    },
    spotify: function() {
        var searchObj = {
            type: 'track',
            query: this.nameValue,
            limit: 1
        };
        this.spotifyHandle.search(searchObj, function(err, data) {
            if (err) {
                console.error(err);
            }
            app.displaySongInfo(data);
        })
    },
    displaySongInfo: function(song) {
        try {
            console.log("\n\nArtist: " + song.tracks.items[0].artists[0].name);
            fileSystem.appendFile(process.env.LOG_PATH || "log.txt", "\n\nArtist: " + song.tracks.items[0].artists[0].name, function(err) {
                if (err) {
                    console.error(err);
                }
            });
        }
        catch (e) {
            console.log("\n\nArtist: n/a");
            fileSystem.appendFile(process.env.LOG_PATH || "log.txt", "\n\nArtist: n/a", function(err) {
                if (err) {
                    console.error(err);
                }
            });
        }
        try {
            console.log("Song Title: " +song.tracks.items[0].name);
            fileSystem.appendFile(process.env.LOG_PATH || "log.txt", "\nSong Title: " +song.tracks.items[0].name, function(err) {
                if (err) {
                    console.error(err);
                }
            });
        }
        catch (e) {
            console.log("Song Title: n/a");
            fileSystem.appendFile(process.env.LOG_PATH || "log.txt", "\nSong Title: n/a", function(err) {
                if (err) {
                    console.error(err);
                }
            });
        }
        try {
            console.log("Preview URL: " + song.tracks.items[0].preview_url);
            fileSystem.appendFile(process.env.LOG_PATH || "log.txt", "\nPreview URL: " + song.tracks.items[0].preview_url, function(err) {
                if (err) {
                    console.error(err);
                }
            });
        }
        catch (e) {
            console.log("Preview URL: n/a");
            fileSystem.appendFile(process.env.LOG_PATH || "log.txt", "\nPreview URL: n/a", function(err) {
                if (err) {
                    console.error(err);
                }
            });
        }
        try {
            console.log("Album Name: " + song.tracks.items[0].album.name);
            fileSystem.appendFile(process.env.LOG_PATH || "log.txt", "\nAlbum Name: " + song.tracks.items[0].album.name, function(err) {
                if (err) {
                    console.error(err);
                }
            });
        }
        catch (e) {
            console.log("Album Name: n/a");
            fileSystem.appendFile(process.env.LOG_PATH || "log.txt", "\nAlbum Name: n/a", function(err) {
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
        if (this.nameValue === undefined) {
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
            console.log("IMBD Rating: " + movie.Ratings[0].Value);
            fileSystem.appendFile(process.env.LOG_PATH || "log.txt", "\nIMBD Rating: " + movie.Ratings[0].Value, function(err) {
                if (err) {
                    console.error(err);
                }
            });
        }
        catch (e) {
            console.log("IMBD Rating: n/a");
            fileSystem.appendFile(process.env.LOG_PATH || "log.txt", "\nIMBD Rating: n/a", function(err) {
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
else {
    app.nameValue = process.argv.splice(3, process.argv.length).join(" ");
    app[app.commandMap[app.command]]();
}