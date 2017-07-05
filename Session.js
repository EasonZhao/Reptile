var net = require('net');
var Decoder = require('./protocol/Decoder');
var Message = require('./protocol/message');
var IPv4ToBuf = require('./protocol/utils').IPv4ToBuf;
var randomNonce = require('./protocol/utils').randomNonce;

var dispatch_message = function(message) {
  console.log('[attach_command] ' , message.heading_.command);
  if (message.heading_.command === 'version') {
    var ack = new Message({command:'verack'});
    this.send_command(ack);
  }
};
function Session(address, port) {
  this.client_ = new net.Socket();
  this.address_ = address;
  this.port_ = port;
  this.decoder_ = new Decoder(this);
  this.decoder_.handle_ = dispatch_message.bind(this);
  this.nonce_ = randomNonce(19);
}

Session.prototype.start = function() {
  this.client_.connect(this.port_, this.address_, function(err) {
    if (err) throw err;
    console.log('[Session] ', 'connected and send version command');
    var message = new Message({
      command : 'version',
      version : 70012,
      services : 1,
      addr_recv_services : 1,
      addr_recv_IP_address : IPv4ToBuf(this.client_.remoteAddress),
      addr_recv_port : this.client_.remotePort,
      nonce : this.nonce_,
      start_height : 0,
      relay : true
    });
    //send version cmd
    this.send_command(message);
  }.bind(this));

  this.client_.on('data', function(data) {
    //console.log('[client data] ', data.toString());
    this.decoder_.append(data);
    this.decoder_.decode();
  }.bind(this));

};

Session.prototype.send_command = function(message) {
  console.log('[send_command] ', message.heading_.command);
  this.client_.write(message.data());
};

Session.prototype.attach_command = function(message) {

};

var host = '192.168.1.136';
var port = 5251;
var se = new Session(host, port);
se.start();

module.exports = Session;
