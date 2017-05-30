const $ = require('jquery');
const exec = require('child_process').exec;
const http = require('http');
var path = require('path');
var appDir = path.dirname(require.main.filename);

console.log(appDir);


var fileDir = 'src/';
var checkApis = [
  '/api/newsstories/getnewsstories/'
];

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
        runJsHint(dir, file);
      }
    }
  });
  return filelist;
};
// function to run each specified file through js linter
function runJsHint(fileDir, fileName){
  var command = "./node_modules/.bin/eslint " + fileDir + fileName;
  console.log("Linting: " + fileDir + fileName);

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
  });
}

/*function testDatabase(tableName){
  var apiCheck = appDir + tableName;
  http.get(apiCheck, (res) => {
    const { statusCode } = res;
    console.log(res);
  });
  /*$.ajax({
    url: tableName,
    type: 'GET'
  })
  .done((data) => {
    console.log(data);
  })
  .fail((jqXhr) => {
    console.log(jqXhr);
  })
  return true;
}*/




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
//getAllFiles(fileDir);
/*http.get('/api/newsstories/getnewsstories/', (res) => {
  const { statusCode } = res;
  console.log(res);
});
*/
var apiCheck = appDir + tableName;
http.get(apiCheck, (res) => {
  const { statusCode } = res;
  console.log(res);
});

// Test the database tables
/*for(var index = 0; index <= checkApis.length; index++){
  testDatabase(checkApis.index);
}*/
