var redis = require('node-redis');
const ipInt = require('ip-to-int');
const HASH_MAP_KEY = 'MVSD_SEED_NOODS';

var updateAddresses = function(addresses, handle) {
  var client = redis.createClient(6379, '127.0.0.1');
  client.on('ready',function(res){
    console.log('ready');
  });

  client.on("error", function(err) {
    throw err;
  });
  
  client.on('connect', function() {
    client.select('0', function(err) {
      if (err) throw err;
      addresses.forEach(function(addr) {
        var index = ipInt(addr).toInt();
        var key = 'node' + index.toString();
        client.hset(HASH_MAP_KEY, key, addr);
      });
      client.end(); 
      handle();
    });
  });
};

module.exports.updateAddresses = updateAddresses;
