var bitcoin_hash = require('./utils').hash;

const HEADING_SIZE = 24;

/**
 * construct a heading
 * @param  {Buffer}  data  Binary data
 * @return {Object}  heading object
 */
var heading = module.exports = function() {
  // if (Buffer.isBuffer(data)) {
  //   this.magic = data.readInt32LE();
  //   this.command = data.slice(4, data.indexOf(0x00, 4)).toString();
  //   this.payload_size = data.readInt32LE(16, 4);
  //   this.checksum = data.slice(20, 24);
  // } else if (data) {
  //   this.command = data;
  // }
  return this;
};
heading.prototype.magic = 1297307213;
heading.prototype.command = '';
heading.prototype.payload_size = 0;
heading.prototype.checksum = [0x00, 0x00, 0x00, 0x00];

heading.prototype.data = function(payload) {
  if (payload) {
    this.payload_size = payload.length;
    this.checksum = bitcoin_hash(payload);
  } else {
    this.payload_size = 0;
    this.checksum = bitcoin_hash('');
  }
  var buf = new Buffer(HEADING_SIZE);
  buf.fill(0);
  buf.writeInt32LE(this.magic, 0);
  var tmp = new Buffer(this.command);
  tmp.copy(buf, 4);
  buf.writeInt32LE(this.payload_size, 16);
  this.checksum.copy(buf, 20);
  return buf;
};

module.exports.fromData = function(data) {
  var head = new heading;
  head.magic = data.readInt32LE();
  head.command = data.slice(4, data.indexOf(0x00, 4)).toString();
  head.payload_size = data.readInt32LE(16, 4);
  head.checksum = data.slice(20, 24);
  return head;
};
