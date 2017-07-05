var assert = require('assert');
var heading = require('./heading');
var payload = require('./payload');
var Message = require('./message');

var state = {
  featch_heading : 1,
  featch_payload : 2
};

const HEADING_SIZE = 24;

function Decoder() {
  this.state_ = state.featch_heading;
  this.data_ = new Buffer(0);
  this.message_ = new Message();
}

Decoder.prototype.decode = function() {
  if (this.state_ === state.featch_heading) {
    if (this.data_.length < HEADING_SIZE) {
      return;
    } else {
      this.message_.heading_ = heading.fromData(
        this.data_.slice(0, HEADING_SIZE));
      this.data_ = this.data_.slice(HEADING_SIZE);
      this.state_ = state.featch_payload;
      this.decode();
    }
  } else if (this.state_ === state.featch_payload) {
    var payload_size = this.message_.heading_.payload_size;
    if (payload_size > this.data_.length) {
      return;
    }
    this.message_.payload_ =
      payload.fromData(this.message_.heading_.command,
      this.data_.slice(0,payload_size));
    //
    if (this.handle_)
      this.handle_(this.message_);
    this.data_ = this.data_.slice(payload_size);
    this.state_ = state.featch_heading;
    this.decode();
  } else {
    assert(false, 'Decoder.docode() state error.');
  }
};

Decoder.prototype.append = function(data) {
  this.data_ = Buffer.concat([this.data_, data]);
  assert(Buffer.isBuffer(data), 'Decoder.append() param error.');
  this.decode();
};

module.exports = Decoder;
