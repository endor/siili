var sys = require('sys'),
  go_server = require('../../lib/go_server').go_server,
  assert = require('assert');
  
(function test_new_game() {
  var response = stub_response();
  
  go_server()({url: '/games/new?size_of_field=9'}, response);

  data = JSON.parse(response.data);
  assert.ok(data.id.toString().match(/\d{8}/));
  assert.ok(data.player.toString().match(/\d{8}/));
  assert.ok(data.player != data.id);
  assert.equal(response.headers["Content-Type"], 'application/json');
  assert.equal(response.status, 200);
  assert.ok(response.closed);
})();

(function test_show_game() {
  var server = go_server();
  
  var response = stub_response();
  server({url: '/games/new?size_of_field=9'}, response);
  
  var id = JSON.parse(response.data).id;
  response = stub_response();
  server({url: '/games/show?id=' + id}, response);

  var data = JSON.parse(response.data);
  assert.equal(data.id, id);
  assert.equal(data.board[1][1], 0);
  assert.equal(response.status, 200);
  
  response = stub_response();
  server({url: '/games/show?id=' + 123}, response);

  var data = JSON.parse(response.data);
  assert.equal(data.message, 'Game does not exist.');
  assert.equal(response.status, 404);  
})();

(function test_join_game() {
  var server, data, id, response;
  
  server = go_server();
  
  response = stub_response();
  server({url: '/games/new?size_of_field=9'}, response);
  
  id = JSON.parse(response.data).id;
  response = stub_response();
  server({url: '/games/join?id=' + id}, response);
  
  data = JSON.parse(response.data);
  assert.ok(data.player.toString().match(/\d{8}/));
  assert.equal(data.id, id);
  assert.equal(response.status, 200);
  
  response = stub_response();
  server({url: '/games/join?id=' + id}, response);
  
  data = JSON.parse(response.data);
  assert.equal(data.message, 'Game already has two players.');
  assert.equal(response.status, 403);  
})();



function stub_response() {
  return({
    sendHeader: function(status, headers) {
      this.status = status;
      this.headers = headers;
    },
    write: function(data) {
      this.data = (this.data || '') + data;
    },
    close: function() {
      this.closed = true;
    }
  });
};

function stub_client(function_name) {
  var data = extract_data(arguments);
  var client = {subdomains: [], api_keys: [], parameters: []};
  var i = 0;
  client[function_name] = function(subdomain, api_key, parameters_callback) {
    this.subdomains.push(subdomain);
    this.api_keys.push(api_key);
    this.parameters.push(arguments.length == 4 ? parameters_callback : {});
    var callback = arguments.length == 4 ? arguments[3] : arguments[2];
    for(var j in data[i]) {
      callback(data[i][j]);
    };
    i++;
    callback(null);
  };
  return client;
  
  function extract_data(args) {
    var data = [];
    for(var i in args) {
      if(i > 0) {
        data[i-1] = args[i];
      };
    };
    return data;
  }
};