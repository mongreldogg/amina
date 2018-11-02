/**
 * Amina front-end application
 * TODO: powered by & license
 */

 const mespeak = require('mespeak');

mespeak.loadVoice(require('./mespeak/voices/en/en-n.json'));
mespeak.loadConfig(require('./mespeak/mespeak_config.json'));
mespeak.speak('hey, i\'m Ameena', { //'ee' instead 'a' lol
    variant: 'f5',
    amplitude: 150,
    pitch: 80,
    speed: 160,
    wordgap: -2
});