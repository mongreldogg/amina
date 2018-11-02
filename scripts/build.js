let shell = require('shelljs');
let tar = require('tar');
let hostile = require('hostile');
let exec = require('child_process');
let fs = require('fs');

fs.readdirSync('backup', function(err, files) {
    if (err) {
        throw err
    } else if (!files.length) {
        fs.mkdirSync('backup')
    }
});

shell.exec('docker-machine start');
exec.exec('docker-machine env', (err, stdout) => {
    if(err) throw err;
    var hostIP = stdout.match(/(\d+\.\d+\.\d+\.\d+)/g)[0];
    console.log('Host IP is '+hostIP+', updating hosts...');
    hostile.set(hostIP, 'amina.web', (err) => {
        if(err) throw err;
        shell.cd('./core');
        console.log('Composing core package for build...');
        tar.c({ //TODO: check if core package exists and prompt for overwrite
            gzip: true,
            file: 'core.tar.gz',
        }, ['model', 'scripts', 'index.js', 'package.json']
        ).then(_ => {
            console.log('Preparing for Docker build...');
            shell.mv('core.tar.gz', '../');
            shell.cd('..');
            console.log('Building docker image...');
            shell.exec('docker build -t amina .');
        });
    });
});