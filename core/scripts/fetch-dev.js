let shell = require('shelljs');
let console = require('console');

console.log('Fetching package core');
shell.cp('/amina/package.json', '/usr/share/amina/package.json');
shell.cp('/amina/index.js', '/usr/share/amina/index.js');

console.log('Fetching scripts');
shell.cp('-r', '/amina/scripts/', '/usr/share/amina/scripts/');

console.log('Fetching lexical models');
shell.cp('-r', '/amina/model/', '/usr/share/amina/model/');

console.log('Fetching web folder');
shell.cp('-r', '/amina/web/', '/var/www/html/');
