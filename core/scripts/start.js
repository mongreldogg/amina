//TODO: initialize parallel decoders for all languages for switching purpose
//TODO: implement language switching
//TODO: wrap recognition service to object

var ps = require('pocketsphinx').ps;
var fs = require('fs');

console.log('Initializing decoder...');

var configFile = JSON.parse(fs.readFileSync('./model/config.json'));

var lang = 'en';

var config = new ps.Decoder.defaultConfig();
config.setString("-hmm", configFile[lang].hmm);
config.setString("-dict", configFile[lang].dict);
config.setString("-lm", configFile[lang].lm);
//config.setString("-logfn", "/dev/null");
config.setFloat("-samprate", 48000);
config.setInt("-nfft", 8192);
//TODO: sync decoder config with client FFT and sampleRate

console.log('Initializing service...');

var http = require('http');
var websocket = require('websocket-stream');
var Stream = require('stream');
var empty = require('dev-null');

var httpServer = http.createServer(()=>{});

var wss = websocket.createServer({server: httpServer, perMessageDeflate: false}, function(stream, request){
    console.log('Amina connected!');
    console.log('Starting continuous recognition module...');
    var decoder = new ps.Decoder(config);
    decoder.startUtt();
    var recognitionStream = new Stream.PassThrough({objectMode: false, highWaterMark: 512});
    //TODO: async checking for similarity of 2 recognition hypothesises (e.g. 2-3 seconds)
    //Reason: prevent recognition from flushing buffer after finding first successful hypo
    var chunksReceived = 0;
    recognitionStream.on('data', function(chunk){
        console.log('Chunk: '+chunk.length+'('+(++chunksReceived)+')');
        try {
            decoder.processRaw(chunk, false, false);
            var hyp = decoder.hyp();
            if(hyp) console.log((new Date()).toLocaleString()+': '+JSON.stringify(hyp));
        } catch(err){
            transferError(err);
        }
    });
    recognitionStream.on('end', function(){
        decoder.endUtt();
    })
    recognitionStream.on('error', transferError);
    stream.on('error', transferError);
    recognitionStream.pipe(empty());
    stream.pipe(recognitionStream);
});

function transferError(err) {
    console.log('Transfer closed: '+err.message);
}

wss.on('error', transferError);

console.log('Starting service...');

httpServer.listen(3454, (err) => {
    if(err) throw err;
    console.log('TO THE MOON!!!');
});