var static = require("../vendor/static/static").static,
  sys = require("sys"),
  querystring = require('querystring');

exports.go_server = function() {
  var actions = require('./actions').actions();
  var games = [];
  
  return function(req, res) {
    var query = req.url;
    var path = query.split('?')[0];
    var params_string = querystring.unescape(query.split('?')[1] + ''); 
    var params = params_string.split('&').map(param_to_array).reduce(param_arrays_to_hash, {});
    var action = actions[path];

    if(action) {
      action(params, res, games);
    } else {
      static("public", req, res);
    }
  };
  
  function param_arrays_to_hash(accumulator, current) {
    var name = current[0];
    var value = current[1];
    if(name.substr(-2) == '[]') {
      var normalized_name = name.substr(0, name.length -2);
      accumulator[normalized_name] = accumulator[normalized_name] || [];
      accumulator[normalized_name].push(value);
    } else {
      accumulator[name] = value;
    }
    return accumulator;
  };
  
  function param_to_array(param) {
    return param.split('=');
  };
};