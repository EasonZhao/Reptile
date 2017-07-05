var heading = require('./heading');
var payload = require('./payload');
var bitcoin_hash = require('./utils').hash;

var Message = module.exports = function(propertys) {
  if (propertys) {
    this.heading_ = new heading();
    this.heading_.command = propertys.command;

    if (this.heading_.command === 'version') {
      this.payload_ = new payload.payload_version(propertys);
    } else if(this.heading_.command === 'verack') {

    } else if(this.heading_.command === 'getaddr') {
      
    }
  }
  return this;
};

/**
 * construct a Message by buffer
 * @param  {Buffer} data  Binary data
 * @return {Message}      Message
 */
module.exports.fromData = function(data) {
  var msg = new Message();
  msg.heading_ = heading.fromData(data.slice(0, 24));
  if (msg.heading_.payload_size != data.length - 24)
    throw Error('Payload length error.');
  //checksum
  var payload_data = data.slice(24);
  if (msg.heading_.checksum.compare(bitcoin_hash(payload_data)) != 0)
    throw Error('Payload checksum error.');
  msg.payload_ = payload.fromData(msg.heading_.command, data.slice(24));
  return msg;
};

module.exports.CreateByHeadData = function(data) {
  if (data.length != 24)
    throw Error('Head data size error.');
  var msg = new Message();
  msg.heading_ = heading.fromData(data);
  return msg;
};

Message.prototype = {
  constructor : Message,
  data : function() {
    if (!this.payload_)
      return this.heading_.data('');
    var pl_data = this.payload_.data();
    return Buffer.concat([this.heading_.data(pl_data), pl_data]);
  },
  payload_size : function() {
    return this.heading_.payload_size;
  },
  attachPayloadData : function(data) {
    if (this.heading_.checksum.compare(bitcoin_hash(data)) != 0)
      throw Error('Payload checksum error.');
    this.payload_ = payload.fromData(this.heading_.command, data);
  }
};
