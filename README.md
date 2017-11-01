# LiriJS
LiriJS is a language interpretation and recognition interface. It is used in the command line to display information about movies, songs, and recent tweets. LiriJS makes use of the OMDB API, the Spotify API, and the Twitter API. LiriJS was built with friendly user interaction in mind. From v1.0.0 the application includes a help command that displays all important command information to the user.

## Getting Started
The following is a getting started guide for how to run LiriJS on your machine.

### Prerequisites
1. NodeJS - LiriJS is a node application and requires node to be installed to run.

To install node visit [NodeJS Website](https://nodejs.org/en/ "Node.js") and install node for your operating system.

### Get The Code
There is currently no installer for LiriJS so you must get the code and run the app using the node command. There are two ways you can get the code.
1. Fork this repository to your computer.
  * ![Fork This Repo](https://raw.githubusercontent.com/amcnulty/liri-node-app/master/readme_res/fork.JPG "Fork This Repo")
2. Download the repository as a zip file to your computer.
  * ![Download This Repo](https://raw.githubusercontent.com/amcnulty/liri-node-app/master/readme_res/download.JPG "Download This Repo")

### Install Dependencies
Once the code is installed on your computer navigate to root of the project in a bash/terminal/command prompt of your choice. Run the following node command to install the required dependencies.

```
$ npm install
```

### Run LiriJS
Once the dependencies have finished installing run the following node command to test if your are able to run LiriJS.

```
$ node liri.js --version
```

This should print out the latest build version of LiriJS. You should see something like this.

```
  Liri.js v1.1.3
```

### Add LiriJS to local npm package [optional]
LiriJS comes with the option of adding the project as a package to the local npm directory. This allows the user to run the same commands while omitting node and the .js file extension.

To set this up run the following command

```
$ npm install <directory of liri-node-app>
```

Now you should be able to run commands as seen in the following examples.

```
$ liri --version
```

Will print something like

```
  Liri.js v1.1.3
```

## Usage
LiriJS comes with only a few commands but it is important to know what they are and how to use them. The commands are listed here and you can also view the commands from the application itself by running the help command.

Displays application commands and usage to the console.
```
$ node liri.js --help
```

Basic usage pattern:
```
$ node liri.js [command] [name value]
```

### Commands
This table lists all available commands and their functionality.

|Command                        |Description                                                   |
|:-----------------------------:|--------------------------------------------------------------|
|-h, --h, -help, --help         |Display help information.                                     |
|-v, --version                  |Displays current LiriJS version.                              |
|my-tweets                      |Returns last twenty tweets from Aaron Michael McNulty.        |
|spotify-this-song [name value] |Returns song information for provided name value.             |
|movie-this [name value]        |Returns movie information for provided name value.            |
|do-what-it-says                |Runs the command that is stored in random.txt                 |

## Built With
LiriJS was built with the following technologies.

* NodeJS
* NPM
* Request npm module
* Twitter npm module
* Node-spotify-api npm module
* Chalk npm module
* Dot-env npm module

## Versioning
[npm-version](https://docs.npmjs.com/cli/version "version | npm Documentation") is used to track build versions.

## Author
#### Aaron Michael McNulty
* [Github Link](https://github.com/amcnulty "amcnulty (Aaron Michael McNulty)")
* [Personal Website](http://www.aaronmichael.tk "Aaron Michael McNulty")

## Links
* [NodeJS Website](https://nodejs.org/en/ "Node.js")
* [Request Module](https://www.npmjs.com/package/request "Request")
* [Twitter Module](https://www.npmjs.com/package/twitter "Twitter")
* [Node-Spotify-API Module](https://www.npmjs.com/package/node-spotify-api "Node-Spotify-API")
* [Chalk Module](https://www.npmjs.com/package/chalk "Chalk")
* [Dot-env Module](https://www.npmjs.com/package/dot-env "Dot-env")