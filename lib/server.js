var sys = require("sys"),
  http = require("http"),
  go_server = require('./go_server').go_server,
  port = 3000,
  host = '127.0.0.1';

process.addListener('uncaughtException', function (err) {
  sys.puts('Caught exception: ' + err);
});

sys.puts("* go.js running on http://" + host + ":" + port);

http.createServer(go_server()).listen(port, host);