var net = require('net');
var Message = require('./protocol/message');
var randomNonce = require('./protocol/utils').randomNonce;
var IPv4ToBuf = require('./protocol/utils').IPv4ToBuf;

var host = '139.59.39.196';
var port = 5251;

var nonce = randomNonce(19);
var client = new net.Socket();

client.connect(port, host, function(err) {
  if (err) throw err;
  console.log('seed connected.');
  var msg = new Message({
    command : 'version',
    version : 70012,
    services : 1,
    addr_recv_services : 1,
    addr_recv_IP_address : IPv4ToBuf(client.remoteAddress),
    addr_recv_port : client.remotePort,
    nonce : nonce,
    start_height : 0,
    relay : true
  });
  //console.log(msg.data());
  console.log('send version');
  client.write(msg.data());
});

client.on('data', function(data) {
  var msg = Message.fromData(data);
  console.log(msg.heading_.command);
  if (msg.heading_.command === 'version' && msg.payload_.relay) {
    console.log('send verack');
    var ack = new Message({command:'verack'});
    console.log(ack.data());
    client.write(ack.data());
  }
});

client.on('close', function() {
  console.log('seed disconnect.');
});
