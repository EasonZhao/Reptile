var net = require('net');
var moment = require('moment');
var updateAddresses = require('./db').updateAddresses;
var moment = require('moment');
var Decoder = require('./protocol/Decoder');
var Message = require('./protocol/message');
var IPv4ToBuf = require('./protocol/utils').IPv4ToBuf;
var randomNonce = require('./protocol/utils').randomNonce;
const util = require('util');
const cfg = require('./config');

var dispatch_message = function(message) {
  //console.log(moment().format('YYYY-MM-DD, hh:mm:ss'), '[attach_command] ' , message.heading_.command);
  if (message.heading_.command === 'version') {
    var ack = new Message({command:'verack'});
    this.send_command(ack);
  } else if (message.heading_.command === 'verack') {
    var getaddr = new Message({command:'getaddr'});
    this.send_command(getaddr);
  } else if (message.heading_.command === 'addr') {
    var arr = new Array();
    message.payload_.addresses.forEach(function(address) {
      arr.push(address.ip);
    });
    updateAddresses(arr, function() {
      console.log('write to redis');
      setTimeout(function() {
        this.stop();
      }.bind(this), cfg.delay);
    }.bind(this));
  }
};

function Session(opt) {
  this.client_ = new net.Socket();
  this.client_.setTimeout(cfg.timeout);
  this.opt_ = opt;
  this.decoder_ = new Decoder(this);
  this.decoder_.handle_ = dispatch_message.bind(this);
  this.nonce_ = randomNonce(19);
}

Session.prototype.start = function() {
  var option = {
    port : this.opt_.port,
    host : this.opt_.host
  };
  this.client_.connect(option, function(err) {
    if (err) throw err;
    console.log('[Session] ', 'connected', moment());
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

  this.client_.on('end', function(data) {
    console.log('[Session] socket disconnect', moment());
  });
  
  this.client_.on('timeout', () => {
    console.log('timeout');
    this.client_.end(); 
  });
};

Session.prototype.stop = function() {
  this.client_.end();
};

Session.prototype.send_command = function(message) {
  console.log('[send_command] ', message.heading_.command);
  this.client_.write(message.data());
};

var main = function() {
  var opt = {
    port : cfg.seed.port,
    host : cfg.seed.host
  };
  var se = new Session(opt);
  se.start();
};

main();

module.exports = Session;
