const WebSocket = require('ws');
const ws        = new WebSocket('ws://localhost:8080');

ws.on('open', function open() {

});

ws.on('message', function incoming(data, flags) {
  // flags.binary will be set if a binary data is received.
  // flags.masked will be set if the data was masked.
  console.log('received: %s', data);
});
