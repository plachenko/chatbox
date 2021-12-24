const tmi = require('tmi.js');
const dotenv = require('dotenv');
dotenv.config();
const ws = require('ws');

const wss = new ws.WebSocketServer({
    port: 6969
});
const wsc = new ws.WebSocket('ws://localhost:6969');

// Format Emotes by AlcaDesign
// yoinked from https://github.com/tmijs/tmi.js/issues/11#issuecomment-116459845
// Adjusted for v2 animated emote endpoint
function formatEmotes(text, emotes) {
    var splitText = text.split('');
    for(var i in emotes) {
        var e = emotes[i];
        for(var j in e) {
            var mote = e[j];
            if(typeof mote == 'string') {
                mote = mote.split('-');
                mote = [parseInt(mote[0]), parseInt(mote[1])];
                var length =  mote[1] - mote[0],
                    empty = Array.apply(null, new Array(length + 1)).map(function() { return '' });
                splitText = splitText.slice(0, mote[0]).concat(empty).concat(splitText.slice(mote[1] + 1, splitText.length));
                splitText.splice(mote[0], 1, '|<img class="emoticon" src="http://static-cdn.jtvnw.net/emoticons/v2/' + i + '/default/dark/1.0">|');
            }
        }
    }
    return splitText.join('');
}

wss.on('connection', (socket)=>{
    socket.on('message', (data)=>{
        wss.clients.forEach((client)=>{
            if (client.readyState === ws.WebSocket.OPEN) {
              client.send(data.toString());
            }
        });
    });
});

const client = new tmi.Client({
  connection: {
    secure: true,
    reconnect: true
  },
  identity: {
    username: `${process.env.TWITCH_USERNAME}`,
    password: `${process.env.TWITCH_OAUTH_TOKEN}`
  },
  channels: [`${process.env.TWITCH_USERNAME}`]
});

client.connect();

client.on('message', (channel, tags, message, self) => {
  // Ignore echoed messages.
    if(self) return;

    if(tags.emotes){
        message = formatEmotes(message, tags.emotes);
    }

    sendMessage(tags.username, message, tags.color);
});

function sendMessage(usr, msg, color){
    if(!color) color = `#${Math.floor(Math.random()*16777215).toString(16)}`;
    let obj = {
        user: usr,
        message: msg,
        color: color
    }
    let jsOb = JSON.stringify(obj);
    wsc.send(jsOb);
}
