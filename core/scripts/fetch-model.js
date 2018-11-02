let shell = require('shelljs');
let consolde = require('console');

console.log('Fetching lexical models');
shell.cp('-r', '/amina/model/', '/usr/share/amina/model/');