let shell = require('shelljs');
let console = require('console');

console.log('Fetching package core');
shell.cp('/amina/package.json', '/usr/share/amina/package.json');
shell.cp('/amina/index.js', '/usr/share/amina/index.js');

console.log('Fetching scripts');
shell.cp('-r', '/amina/scripts/', '/usr/share/amina/scripts/');

shell.cd('/usr/share/amina');
shell.exec('npm install cmake-js --save-dev && npm install pocketsphinx --save-dev && npm install');

//TODO: "would you like to fetch models too?"