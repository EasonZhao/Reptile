var assert = require('assert');
var Message = require('../protocol/message');
var bitcoin_hash = require('../protocol/utils').hash;
var IPv4ToBuf = require('../protocol/utils').IPv4ToBuf;

var data = new Buffer([
  0x4d, 0x56, 0x53, 0x4d,
  0x76, 0x65, 0x72, 0x73, 0x69, 0x6f, 0x6e, 0x00,
  0x00, 0x00, 0x00, 0x00,
  0x67, 0x00, 0x00, 0x00,
  0x16, 0x1f, 0x08, 0x29,
  0x7c, 0x11, 0x01, 0x00,                             //version
  0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,     //services
  0x10, 0xf4, 0x59, 0x59, 0x00, 0x00, 0x00, 0x00,     //timestamp
  0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,     //addr_recv services
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,     //addr_recv IP
  0x00, 0x00, 0xff, 0xff, 0xb4, 0xa9, 0x45, 0xae,
  0xf3, 0x72,                                         //addr_recv port
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,     //addr_trans services
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0xff, 0xff, 0x00, 0x00, 0x00, 0x00,     //addr_trans IP
  0x00, 0x00,                                         //addr_trans port
  0xaf, 0xdd, 0xb1, 0x4a, 0x66, 0x4f, 0x58, 0x77,     //nonce
  0x11,                                               //agent size
  0x2f, 0x6d, 0x65, 0x74, 0x61, 0x76, 0x65, 0x72,
  0x73, 0x65, 0x3a, 0x30, 0x2e, 0x36, 0x2e, 0x38,
  0x2f,                                               //agent
  0x00, 0x00, 0x00, 0x00,                             //start height
  0x01                                                //Relay
]);
describe('Protocol', function() {
    describe('#message version deserialization', function() {
    //var msg = Message();
    var msg = Message.CreateByHeadData(data.slice(0, 24));
    var head = msg.heading_;
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

    msg.attachPayloadData(data.slice(24));
    var pl = msg.payload_;
    it('version is 70012', function() {
      assert.equal(pl.version, 70012);
    });

    it('services is NODE_NETWORK(1)', function() {
      assert.equal(pl.services, 1);
    });

    it('timestamp is 1499067408', function() {
      assert.equal(pl.timestamp, 1499067408);
    });

    it('addr_recv services 1', function() {
      assert.equal(pl.addr_recv_services, 1);
    });

    it('addr_recv IP address is ok', function() {
      //console.log(pl.addr_recv_IP_address);
    });

    it('addr_recv IP port is 29427', function() {
      assert.equal(pl.addr_recv_port, 29427);
    });

    it('addr_trans services is NODE_NETWORK(1) or Unnamed', function() {
      var result = pl.addr_trans_services === 0
        || pl.addr_trans_services === 1;
      assert.equal(result, true);
    });

    it('addr_trans IP address is ok', function() {
      //console.log(pl.addr_trans_IP_address);
    });

    it('addr_trans IP port is 0', function() {
      assert.equal(pl.addr_trans_port, 0);
    });

    it('nonce is 0', function() {
      assert.equal(pl.nonce, 8599710789222391000);
    });

    it('agent size is 17', function() {
      assert.equal(pl.agent_size, 17);
    });

    it('agent is /metaverse:0.6.8/', function() {
      assert.equal(pl.agent, '/metaverse:0.6.8/');
    });

    it('relay is true', function() {
      assert.ok(pl.relay);
    });
  });

  describe('#message version', function() {
    var pros = {
      command : 'version',
      version : 70012,
      services : 0x01,
      timestamp : 1499067408,
      addr_recv_services : 1,
      addr_recv_IP_address : IPv4ToBuf('180.169.69.174'),
      addr_recv_port : 29427,
      // addr_trans_services : 0,
      // addr_trans_IP_address : IPv4ToBuf('0.0.0.0'),
      // addr_trans_port : 0,
      nonce : '8599710789222391215',
      start_height : 0,
      relay : true
    };
    it('serialization ', function() {
      var msg = new Message(pros);
      var buf = msg.data();
      assert.equal(buf.compare(data), 0);
    });
  });

  describe('#message verack', function() {
    var verack_data = new Buffer([
      0x4d, 0x56, 0x53, 0x4d,
      0x76, 0x65, 0x72, 0x61, 0x63, 0x6b, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00,
      0x5d, 0xf6, 0xe0, 0xe2
    ]);
    var msg = Message.fromData(verack_data);
    var head = msg.heading_;
    it('magic is 1297307213', function() {
      assert.equal(head.magic, 1297307213);
    });
    it('command is verack', function() {
      assert.equal(head.command, 'verack');
    });
    it('payload_size is 0', function() {
      assert.equal(head.payload_size, 0);
    });
    it('checksum is ok', function() {
      var buf = bitcoin_hash('');
      assert.equal(buf.compare(head.checksum), 0);
    });
    it('payload is NULL', function() {
      assert.equal(msg.payload_, null);
    });
  });
});
