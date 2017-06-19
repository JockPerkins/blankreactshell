const $ = require('jquery');
const exec = require('child_process').exec;
const http = require('http');

var fs        = require('fs');
var path      = require('path');
var Sequelize = require('sequelize');
var basename  = path.basename(module.filename);
var env       = process.env.NODE_ENV || 'development';
var config    = require(__dirname + '/config/config.json')[env];
var db        = {};
var chalk     = require('chalk');
var Promise   = require('promise');

var fileDir = './src/';

// function to display messages
function displayMessage(type, place){
  if(type == 'error'){
    console.error(chalk.red('Error when testing: ' + place + '\n\n'));
  }
  else if(type == 'success'){
    console.log(chalk.green('Success when testing: ' + place + '\n\n'));
  }
}
// function to run the npm install
function npmInstall(){
  return new Promise(function (fulfill, reject){
    exec('npm install', (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        reject(error);
      }
      else {
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
        fulfill(stdout);
      }
    });
  });
}
// function to test the database authentication
function testDatabase(){
  return new Promise(function (fulfill, reject){
    if (config.use_env_variable) {
      var sequelize = new Sequelize(process.env[config.use_env_variable]);
    }
    else {
      var sequelize = new Sequelize(config.database, config.username, config.password, config);
    }
    sequelize
      .authenticate()
      .then(() => {
        fulfill();
      })
      .catch((err) => {
        reject(err);
      });
  });
}
// Gets all files in the target directory, including subdirectories
function getAllFiles(dir, filelist) {
  return new Promise(function (fulfill, reject){
    var fs = fs || require('fs'), files = fs.readdirSync(dir);
    filelist = filelist || [];
    files.forEach(function(file) {
      if (fs.statSync(dir + file).isDirectory()) {
        getAllFiles(dir + file + '/', filelist);
      }
      else {
        if (file.charAt(0) != '.') {
          filelist.push(dir + file);
        }
      }
    });
    fulfill(filelist);
  });
};
// function to run each specified file through js linter
function runJsLinter(fileDir, files){
  return new Promise(function (fulfill, reject){
    // run through each file
    for(var index = 0; index < files.length; index++){
      var command = "./node_modules/.bin/eslint " + fileDir + files[index];
      exec(command, (error, stdout, stderr) => {
        if (error) {
          //console.error(`exec error: ${error}`);
          console.error(`Test failed with the follow error:`);
          console.error(`${error}`);
          reject(error);
        }
        else {
          console.log(`stdout: ${stdout}`);
          console.log(`stderr: ${stderr}`);
          fulfill();
        }
      });
    }
  });
}

// overall function to run the test
function runTest(){
  console.log("Running node package installer");
  // Run the npm install
  npmInstall().then(() => {
    displayMessage('success', 'npm');
    // Run the database check
    testDatabase().then(() => {
      displayMessage('success', 'database');
      // Get all files to prepare for linting
      getAllFiles(fileDir).then((result) => {
        console.log("Getting files...");
        displayMessage('success', 'get files');
        // Lint all of the files we've got
        runJsLinter(fileDir, result).then(() => {
          displayMessage('success', 'jslint');
          //process.exit(0);
        }).catch((err) => {
          displayMessage('error', 'jslint');
          console.log(err);
          process.exit(1);
        })
      }).catch((err) => {
        displayMessage('error', 'get files');
        console.log(err);
        process.exit(1);
      });
    }).catch((err) => {
      // Database has failed
      displayMessage('error', 'database');
      console.log(err);
      process.exit(1);
    });
  }).catch((err) => {
    // NPM install has failed
    displayMessage('error', 'npm');
    console.log(err);
    process.exit(1);
  });
}

runTest();
