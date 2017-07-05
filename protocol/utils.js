var crypto = require('crypto');
var assert = require('assert');
const util = require('util');

module.exports = {
  hash : function(pwd) {
    var hash = crypto.createHash('sha256').update(pwd).digest();
    return crypto.createHash('sha256').update(hash).digest().slice(0, 4);
  },
  bufToIPv4 : function(data) {
    assert(data.length === 16);
    var ip_data = data.slice(data.lastIndexOf(0xff) + 1);
    assert(ip_data.length === 4);
    return util.format('%d.%d.%d.%d', ip_data[0], ip_data[1], ip_data[2],
      ip_data[3]);
  },
  IPv4ToBuf : function(str) {
    var arr = str.split('.');
    assert(arr.length === 4);
    var data = new Buffer(16);
    data.fill(0x00);
    data.writeUInt16LE(0xffff, 10);
    for(var i = 0; i < arr.length; i++) {
      data.writeUInt8(arr[i], 12 + i);
    }
    return data;
  },
  randomNonce : function(len) {
    var nonce = new String();
    for(var i=0; i < len; i++) {
      nonce += parseInt(Math.random() * 10).toString();
    }
    return nonce;
  }
};
