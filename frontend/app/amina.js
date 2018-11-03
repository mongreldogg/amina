/**
 * Amina front-end application
 * TODO: powered by & license
 */

const mespeak = require('mespeak');

mespeak.loadVoice(require('./mespeak/voices/en/en.json'));
mespeak.loadConfig(require('./mespeak/mespeak_config.json'));

var options = {
    variant: 'f5',
    amplitude: 100,
    pitch: 80,
    speed: 160,
    wordgap: -2
};

//'ee' instead of 'i' lol she doesn't know how to say her name rite
mespeak.speak("hello! i'm Ameena", options, () => {
    
    const websocket = require('websocket-stream');
    const Stream = require('stream');
    var getUserMedia = require('get-user-media-promise');
    var MicrophoneStream = require('microphone-stream');

    var ws = websocket('ws://amina.web:80');

    var micStream = new MicrophoneStream();

    getUserMedia({video: false, audio: true}).then(function(stream){
        micStream.setStream(stream);
        micStream.pipe(ws);
    }).catch(function(error){
        console.log(error);
    });

    var response = new Stream.Duplex({objectMode: false, highWaterMark: 1024});
    
    response.on('data', function(chunk){
        console.log(chunk);
    });

    ws.pipe(response);

}); 

