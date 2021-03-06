var assert = require('assert');
var heading = require('../protocol/heading');
var bitcoin_hash = require('../protocol/utils').hash;
var bufToIPv4 = require('../protocol/utils').bufToIPv4;
var IPv4ToBuf = require('../protocol/utils').IPv4ToBuf;
var randomNonce = require('../protocol/utils').randomNonce;

describe('Protocol', function() {
  var data = new Buffer([
    0x4d, 0x56, 0x53, 0x4d, 0x76, 0x65, 0x72, 0x73, 0x69, 0x6f,
    0x6e, 0x00, 0x00, 0x00, 0x00, 0x00, 0x67, 0x00, 0x00, 0x00,
    0x16, 0x1f, 0x08, 0x29,
    0x7c, 0x11, 0x01, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x10, 0xf4, 0x59, 0x59, 0x00, 0x00, 0x00, 0x00,
    0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xff, 0xff,
    0xb4, 0xa9, 0x45, 0xae, 0xf3, 0x72, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0xaf, 0xdd, 0xb1, 0x4a, 0x66, 0x4f, 0x58, 0x77,
    0x11, 0x2f, 0x6d, 0x65, 0x74, 0x61, 0x76, 0x65, 0x72, 0x73,
    0x65, 0x3a, 0x30, 0x2e, 0x36, 0x2e, 0x38, 0x2f, 0x00, 0x00,
    0x00, 0x00, 0x01
  ]);

  describe('#header', function() {
    var head = heading.fromData(data.slice(0, 24));
    it('magic is 1297307213', function() {
      assert.equal(head.magic, 1297307213);
    });
    it('command is version', function() {
      assert.equal(head.command, 'version');
    });
    it('payload_size is 103', function() {
      assert.equal(head.payload_size, 103);
    });
    it('checksum is ok', function() {
      var val = bitcoin_hash(data.slice(24));
      assert.equal(head.checksum.readUInt32LE(), val.readUInt32LE());
    });
  });

  describe('#bufToIPv4', function() {
    it('IP is 133.130.126.171', function() {
      var buf = new Buffer([
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0xff, 0xff, 0x85, 0x82, 0x7e, 0xab
      ]);
      assert.equal(bufToIPv4(buf), '133.130.126.171');
    });
    it('IP is 0.0.0.0', function() {
      var buf = new Buffer([
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0xff, 0xff, 0x00, 0x00, 0x00, 0x00
      ]);
      assert.equal(bufToIPv4(buf), '0.0.0.0');
    });
  });

  describe('#IPv4ToBuf', function() {
    it('IP is 0x85827eab', function() {
      var str = '133.130.126.171';
      var tmp = IPv4ToBuf(str);
      var buf = new Buffer([
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0xff, 0xff, 0x85, 0x82, 0x7e, 0xab
      ]);
      assert.equal(tmp.compare(buf), 0);
    });
    it('IP is 0x00000000', function() {
      var buf = new Buffer([
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0xff, 0xff, 0x00, 0x00, 0x00, 0x00
      ]);
      var str = '0.0.0.0';
      var tmp = IPv4ToBuf(str);
      assert.equal(tmp.compare(buf), 0);
    });
  });

  describe('#random nonce', function() {
    it('nonce length is 17', function() {
      var nonce = randomNonce(17);
      assert.equal(nonce.length, 17);
    });
  });

  describe('#hash', function() {
    it('pwd is null', function() {
      var val = bitcoin_hash('');
      var bf = new Buffer([0x5d, 0xf6, 0xe0, 0xe2]);
      assert.equal(val.readUInt32LE(), bf.readUInt32LE());
    });
  });

  describe('#serialization', function() {
    var verack_data = new Buffer([
      0x4d, 0x56, 0x53, 0x4d,
      0x76, 0x65, 0x72, 0x61, 0x63, 0x6b, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00,
      0x5d, 0xf6, 0xe0, 0xe2
    ]);
    it('serialization is ok', function() {
      var head = new heading();
      head.command = 'verack';
      var buf = head.data('');
      assert.equal(verack_data.compare(buf), 0);
    });
  });
});
