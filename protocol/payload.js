var Int64LE = require('int64-buffer').Int64LE;
var IPv4ToBuf = require('./utils').IPv4ToBuf;

var payload_version = function(propertys) {
  const agent_size = 17;
  const agent = '/metaverse:0.6.8/';

  this.agent_size = agent_size;
  this.agent = agent;
  this.nonce = '0000000000000000000';
  this.addr_trans_services = 0;
  this.addr_trans_IP_address = IPv4ToBuf('0.0.0.0');
  this.addr_trans_port = 0;
  this.timestamp = parseInt(Date.now() / 1000);
  if (propertys) {
    this.version = propertys.version;
    this.services = propertys.services;
    if (propertys.timestamp)
      this.timestamp = propertys.timestamp;
    this.addr_recv_services = propertys.addr_recv_services;
    this.addr_recv_IP_address = propertys.addr_recv_IP_address;
    this.addr_recv_port = propertys.addr_recv_port;
    if (propertys.addr_trans_services)
      this.addr_trans_services = propertys.addr_trans_services;
    if (propertys.addr_trans_IP_address)
      this.addr_trans_IP_address = propertys.addr_trans_IP_address;
    if (propertys.addr_trans_port)
      this.addr_trans_port = propertys.addr_trans_port;
    if (propertys.nonce)
      this.nonce = propertys.nonce;
    if (propertys.agent)
      this.agent = propertys.agent;
    this.start_height = propertys.start_height;
    this.relay = propertys.relay;
  }
  return this;
};

payload_version.prototype.data = function() {
  var data = new Buffer(103);
  var pos = 0;
  data.fill(0x00);
  data.writeUInt32LE(this.version);
  pos += 4;
  Int64LE(this.services).toBuffer().copy(data, pos);
  pos += 8;
  Int64LE(this.timestamp).toBuffer().copy(data, pos);
  pos += 8;
  Int64LE(this.addr_recv_services).toBuffer().copy(data, pos);
  pos += 8;
  this.addr_recv_IP_address.copy(data, pos);
  pos += 16;
  data.writeUInt16LE(this.addr_recv_port, pos);
  pos += 2;
  Int64LE(this.addr_trans_services).toBuffer().copy(data, pos);
  pos += 8;
  this.addr_trans_IP_address.copy(data, pos);
  pos += 16;
  data.writeUInt16LE(this.addr_trans_port, pos);
  pos += 2;
  Int64LE(this.nonce).toBuffer().copy(data, pos);
  pos += 8;
  data.writeUInt8(this.agent_size, pos);
  pos += 1;
  var tmp = new Buffer(this.agent);
  tmp.copy(data, pos);
  pos += this.agent_size;
  data.writeUInt32LE(this.start_height, pos);
  pos += 4;
  data.writeUInt8(this.relay ? 0x01 : 0x00, pos);
  return data;
};

module.exports = {
  fromData : function(command_name, data) {
    if (command_name === 'version') {
      var pl = new payload_version();
      pl.version = data.readUInt32LE();
      pl.services = Int64LE(data.slice(4, 12)).toNumber();
      pl.timestamp = Int64LE(data.slice(12, 20)).toNumber();
      pl.addr_recv_services = Int64LE(data.slice(20, 28)).toNumber();
      pl.addr_recv_IP_address = data.slice(28, 28 + 16);
      pl.addr_recv_port = data.readUInt16LE(44);
      pl.addr_trans_services = Int64LE(data.slice(46, 54)).toNumber();
      pl.addr_trans_IP_address = data.slice(54, 54 + 16);
      pl.addr_trans_port = data.readUInt16LE(70);
      pl.nonce = Int64LE(data.slice(72, 80)).toString();
      pl.agent_size = data.readInt8(80);
      pl.agent = data.slice(81, 81 + pl.agent_size).toString();
      pl.start_height = data.readInt32LE(81 + pl.agent_size, 81 + pl.agent_size + 4);
      pl.relay = data.readInt8(81 + pl.agent_size +4)[0] === 0x00 ? false : true;
      return pl;
    } else if (command_name === 'verack') {
      return null;
    } else {
      console.log('Unknow command type.');
      return null;
    }
  },
  payload_version : payload_version
};
