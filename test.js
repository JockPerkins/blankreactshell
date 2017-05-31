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

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return false;
    }
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
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
      console.log(chalk.green('Connection has been established successfully.'));
    })
    .catch((err) => {
      console.error(chalk.red('Unable to connect to the database:', err));
    });
}

// Run the npm install
exec('npm install', (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.log(`stderr: ${stderr}`);
});
// Run the js linter
getAllFiles(fileDir);
// Run the database check
testDatabase();
