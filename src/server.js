const tmi = require('tmi.js');
const dotenv = require('dotenv');
dotenv.config();
const ws = require('ws');

let userCred = {
  username: '',
  oauth: '',
  channel: ''
}

let connected = false;

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
      const payload = JSON.parse(data.toString())

      if(payload.type == 'disconnect'){
        client?.disconnect();
        return;
      }

      if(payload.type == 'cred'){
        if(connected) return;
        userCred = payload.payload;
        connectToTwitch();
        return;
      }

        wss.clients.forEach((client)=>{
            if (client.readyState === ws.WebSocket.OPEN) {
              client.send(data.toString());
            }
        });
    });
});

const client = new tmi.Client({
	options: { debug: true },
  connection: {
    secure: true,
    reconnect: true
  }
})

function connectToTwitch(){
  client.identity = { username: userCred.username, password: userCred.oauth };
  client.channels = [userCred.channel];

  client.connect();
}

client.on('connected',(e) => {
  connected = true;
  let obj = {
    type:'serverEvt',
    payload: 'twConnected'
  }
  let jsOb = JSON.stringify(obj);
  wsc.send(jsOb);
});

client.on('disconnected',(e) => {
  connected = false;
  let obj = {
    type:'serverEvt',
    payload: 'twDisconnected'
  }
  let jsOb = JSON.stringify(obj);
  wsc.send(jsOb);
});


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
