/**
 * Amina front-end application
 */

//TODO: powered by & license
//TODO: wrap to object
//TODO: try AudioAnalyserNode 
//to convert to 16bit 16kHz acceptable by PocketSphinx

const amina = require('mespeak');

amina.loadVoice(require('./mespeak/voices/en/en.json'));
amina.loadConfig(require('./mespeak/mespeak_config.json'));

var options = {
    variant: 'f5',
    amplitude: 40,
    pitch: 80,
    speed: 180,
    wordgap: -2
};

//'ee' instead of 'i' lol she doesn't know how to say her name rite
amina.speak("hey' i'm Ameena", options, () => {
    
    var websocket = require('websocket-stream');
    var Stream = require('stream');
    var MicrophoneStream = require('microphone-stream');

    var ws = websocket('ws://amina.ws:3454', {perMessageDeflate: false});

    var micro = new MicrophoneStream({
        objectMode: false,
        context: new AudioContext({
            sampleRate: 48000,
            bitDepth: 16
        })
    });
    //MediaTrackSettings.sampleRate = 8000;

    var bridge = new Stream.PassThrough({objectMode: false});
    bridge.pipe(ws);

    bridge.on('data', function(chunk){

    })

    micro.pipe(bridge);
    micro.on('format', function(format){
        document.body.innerHTML = JSON.stringify(format);
    });

    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    navigator.getUserMedia({video: false, audio: true}, function(stream){
        
        micro.setStream(stream);

    }, function(error){
        document.body.innerHTML = error.message;
    });

    /*var response = new Stream.Duplex({objectMode: true, highWaterMark: 8192});
    
    response.on('data', function(chunk){
        amina.speak(chunk.toString(), options, () => {});
    });

    ws.pipe(response);*/ //TODO: response implementation from websocket -> later

    amina.speak('hearin\'you well! greetings!', options);

}); 

