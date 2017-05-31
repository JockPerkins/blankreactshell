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


var fileDir = './src/';

// function to run the npm install
function npmInstall(){
  exec('npm install', (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return false;
    }
    else {
      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr}`);
      return true;
    }
  });
}
// function to test the database authentication
function testDatabase(){
  if (config.use_env_variable) {
    var sequelize = new Sequelize(process.env[config.use_env_variable]);
  } else {
    var sequelize = new Sequelize(config.database, config.username, config.password, config);
  }

  sequelize
    .authenticate()
    .then(() => {
      return true;
    })
    .catch((err) => {
      return false;
    });
}
// Gets all files in the target directory, including subdirectories
function getAllFiles(dir, filelist) {
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
        //filelist.push(file);
        runJsLinter(dir, file);
      }
    }
  });
  return filelist;
};
// function to run each specified file through js linter
function runJsLinter(fileDir, fileName){
  var command = "./node_modules/.bin/eslint " + fileDir + fileName;


  /*try {
    exec(command, (error, stout, sterr) => {

    });
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
  } catch (error) {
    console.error(`Test failed with the follow error:`);
    console.error(`${error}`);
  }*/

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

function runTest(){
  // Run the npm install
  //var didNpmInstall = ;
  // Check npmInstall returned correctly
  if(npmInstall()){
    console.log(chalk.green('NPM Install was successful.'));
    // Run the database check
    //var didDatabaseConnect = ;
    if(testDatabase()){
      console.log(chalk.green('Connection to database has been established successfully.'));
      // Run the js linter
      if(getAllFiles(fileDir)){
        console.log(chalk.green('Files have all been correctly linted.'));
        return true;
      }
      else {
        console.log(chalk.red('Files need attention, please make the amends listed in the console.'));
        return false;
      }
    }
    else {
      console.error(chalk.red('Unable to connect to the database:', err));
      return false;
    }

  }
  else {
    console.log(chalk.red('Error when running npm install.'));
    return false;
  }
}

if(runTest()){
  console.log(chalk.green("All tests have been completed successfully."));
}
else {
  console.log(chalk.red("Tests failed, please see amendments above."));
}
