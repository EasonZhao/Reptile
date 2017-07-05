var assert = require('assert');
var heading = require('../protocol/heading');
var payload = require('../protocol/payload');

// describe('Protocol', function() {
//   var data = new Buffer([
//     0x4d, 0x56, 0x53, 0x4d, 0x76, 0x65, 0x72, 0x73, 0x69, 0x6f,
//     0x6e, 0x00, 0x00, 0x00, 0x00, 0x00, 0x67, 0x00, 0x00, 0x00,
//     0x16, 0x1f, 0x08, 0x29,
//     0x7c, 0x11, 0x01, 0x00,                             //version
//     0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,     //services
//     0x10, 0xf4, 0x59, 0x59, 0x00, 0x00, 0x00, 0x00,     //timestamp
//     0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,     //addr_recv services
//     0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
//     0x00, 0x00, 0xff, 0xff, 0xb4, 0xa9, 0x45, 0xae,     //addr_recv IP
//     0xf3, 0x72,                                         //addr_recv port
//     0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,     //addr_trans services
//     0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
//     0x00, 0x00, 0xff, 0xff, 0x00, 0x00, 0x00, 0x00,     //addr_trans IP
//     0x00, 0x00,                                         //addr_trans port
//     0xaf, 0xdd, 0xb1, 0x4a, 0x66, 0x4f, 0x58, 0x77,     //nonce
//     0x11,                                               //agent size
//     0x2f, 0x6d, 0x65, 0x74, 0x61, 0x76, 0x65, 0x72,
//     0x73, 0x65, 0x3a, 0x30, 0x2e, 0x36, 0x2e, 0x38,
//     0x2f,                                               //agent
//     0x00, 0x00, 0x00, 0x00,                             //start height
//     0x01                                                //Relay
//   ]);
//   describe('#payload version', function() {
//     var pl = payload.fromData('version', data.slice(24));
//     it('version is 70012', function() {
//       assert.equal(pl.version, 70012);
//     });
//
//     it('services is NODE_NETWORK(1)', function() {
//       assert.equal(pl.services, 1);
//     });
//
//     it('timestamp is ok', function() {
//       assert.equal(pl.timestamp, 1499067408);
//     });
//
//     it('addr_recv services 1', function() {
//       assert.equal(pl.addr_recv_services, 1);
//     });
//
//     it('addr_recv IP address is ok', function() {
//       //console.log(pl.addr_recv_IP_address);
//     });
//
//     it('addr_recv IP port is 29427', function() {
//       assert.equal(pl.addr_recv_port, 29427);
//     });
//
//     it('addr_trans services is NODE_NETWORK(1) or Unnamed', function() {
//       var result = pl.addr_trans_services === 0
//         || pl.addr_trans_services === 1;
//       assert.equal(result, true);
//     });
//
//     it('addr_trans IP address is ok', function() {
//       //console.log(pl.addr_trans_IP_address);
//     });
//
//     it('addr_trans IP port is 0', function() {
//       assert.equal(pl.addr_trans_port, 0);
//     });
//
//     it('nonce is 8599710789222391215', function() {
//       assert.equal(pl.nonce, '8599710789222391215');
//     });
//
//     it('agent size is 17', function() {
//       assert.equal(pl.agent_size, 17);
//     });
//
//     it('agent is /metaverse:0.6.8/', function() {
//       assert.equal(pl.agent, '/metaverse:0.6.8/');
//     });
//
//     it('relay is true', function() {
//       assert.ok(pl.relay);
//     });
//   });
// });
