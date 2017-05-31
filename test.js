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
// function to run each specified file through js linter
function runJsLinter(fileDir, fileName){
  var command = "./node_modules/.bin/eslint " + fileDir + fileName;
  exec(command, (error, stdout, stderr) => {
    if (error) {
      //console.error(`exec error: ${error}`);
      console.error(`Test failed with the follow error:`);
      console.error(`${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
  });
}
// function to display messages
function displayMessage(type, place){
  if(type == 'error'){
    console.error(chalk.red('Error when testing: ' + place));
  }
  else if(type == 'success'){
    console.log(chalk.green('Success when testing: ' + place));
  }
}
// overall function to run the test
function runTest(){
  // Run the npm install
  npmInstall().then(() => {
    displayMessage('success', 'npm');
    // Run the database check
    testDatabase().then(() => {
      displayMessage('success', 'database');
      process.exit(0);
    }).catch((err) => {
      // Database has failed
      displayMessage('error', 'database');
      process.exit(1);
    });
  }).catch((err) => {
    // NPM install has failed
    displayMessage('error', 'npm');
    process.exit(1);
  });
}


// Gets all files in the target directory, including subdirectories
function getAllFiles(dir, filelist) {
  return new Promise(function (fulfill, reject){
    var fs = fs || require('fs'), files = fs.readdirSync(dir);
    filelist = filelist || [];
    files.forEach(function(file) {
      // looks in subdirectories for files
      if (fs.statSync(dir + file).isDirectory()) {
        filelist = getAllFiles(dir + file + '/', filelist);
      }
      else {
        // doesn't add to list if its a hidden file
        if (file.charAt(0) != '.' || file == null) {
          filelist.push(file);
          console.log(file);
          //runJsLinter(dir, file);
        }
      }
    });
    console.log(filelist);
    fulfill(filelist);
  });
};

function testFiles(){
  // Lint the files
  getAllFiles(fileDir).then((result) => {
    displayMessage('success', 'jslint');
    process.exit(0);
  }).catch((err) => {
    console.log(err);
    // Linter has failed
    displayMessage('error', 'jslint');
    process.exit(1);
  });
}

var testing = 1;

if(testing === 1){
  testFiles();
}
else {
  runTest();
}
