let rimraf = require('rimraf');

rimraf('dist', function(){console.log('Successful directory cleanup!')});

let packager = require('electron-packager');

var opts = {
    dir: '.',
    appVersion: process.env.npm_package_version,
    arch: process.argv[3] ? process.argv[3] : 'all',
    platform: process.argv[2] ? process.argv[2] : 'all',
    asar: true,
    prune: true,
    executableName: process.env.npm_package_appName,
    out: 'dist'
};

//TODO: implement bundleId, categories and other store/pull data

packager(opts);