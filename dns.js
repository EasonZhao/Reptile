var dns = require('dns');

dns.lookup('main-asia.mvs.live', function(err, address, family) {
  if (err) throw err;
  console.log('ip : ' + address);
});
