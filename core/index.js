let console = require('console');
let args = process.argv.splice(0, 2);

try {
    let proc = require('./scripts/'+process.argv[0]+'.js');
} catch(ex) {
    console.error(ex.message);
    console.error(ex.stack);
}
