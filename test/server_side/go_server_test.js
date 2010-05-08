var sys = require('sys'),
  go_server = require('../../lib/go_server').go_server,
  assert = require('assert');
  
(function test_projects() {
  var response = stub_response();
  var client = stub_client('projects', ['[{"project":{"name":', '"project1"}}]'], ['[{"project":{"name":', '"project2"}},{"project":{"name":', '"project3"}}]']);
  
  mite_server(client)({url: '/projects?accounts[]=upstream|12345&accounts[]=kriesse|65762'}, response);

  assert.deepEqual(response.data,
    '[{"name":"project1","subdomain":"upstream","api_key":"12345"},{"name":"project2","subdomain":"kriesse","api_key":"65762"},{"name":"project3","subdomain":"kriesse","api_key":"65762"}]');
  assert.equal(response.headers["Content-Type"], 'application/json');
  assert.equal(response.headers["Content-Length"], 182);
  assert.equal(response.status, 200);
  assert.ok(response.closed);
  
  assert.deepEqual(client.subdomains, ['upstream', 'kriesse']);
  assert.deepEqual(client.api_keys, ['12345', '65762']);
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