var ps = require('pocketsphinx').ps;
var websocket = require('websocket-stream');
var Stream = require('stream');
var MicrophoneStream = require('microphone-stream');

console.log('Initializing decoder...');

/*
modeldir = "./model/en-us/"

var config = new ps.Decoder.defaultConfig();
config.setString("-hmm", modeldir + "en-us");
config.setString("-dict", modeldir + "cmudict-en-us.dict");
config.setString("-lm", modeldir + "en-us.lm.bin");
var decoder = new ps.Decoder(config);
*/

modeldir = "./model/ru-ru"

var config = new ps.Decoder.defaultConfig();
config.setString("-hmm", modeldir);
config.setString("-dict", modeldir + "/ru.dic");
config.setString("-lm", modeldir + "/ru.lm");
var decoder = new ps.Decoder(config);

console.log('Starting WebSocket server...');

var http = require('http');

var httpserver = http.createServer(() => {});

console.log('Initializing recognition stream...');

var recognitionStream = new Stream.PassThrough({objectMode: false, highWaterMark: 32768});

var chunkBuffer = [];

recognitionStream.on('data', function(chunk){
    chunkBuffer = chunkBuffer.concat(MicrophoneStream.toRaw(chunk));
    try{
        decoder.processRaw(chunkBuffer, false, false);
        recognitionStream.push(decoder.hyp());
        chunkBuffer = [];
    } catch(err){
        console.log('Error processing raw microphone input: '+err.message);
    }
});

console.log('Starting continuous recognition module...');

decoder.startUtt();

console.log('Opening http server...');

httpserver.listen(80, function(){});

console.log('TO THE MOON!!!...');

var wss = websocket.createServer({server: httpserver, perMessageDeflate: false}, function(stream){
    console.log('Opening a stream for a connected client...');
    stream.pipe(recognitionStream);
    recognitionStream.pipe(stream);
});