let shell = require('shelljs');
let tar = require('tar');

shell.cd('./core');
tar.c({
    gzip: true,
    file: 'core.tar.gz',
}, ['model', 'scripts', 'index.js', 'package.json']
).then(_ => {
    shell.mv('core.tar.gz', '../');
    shell.cd('..');
    shell.exec('docker build -t amina .');
});