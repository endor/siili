var sys = require('sys');

exports.actions = function() {
  var game = require('./game').game();

  return {
    '/games/new': function(params, res, games) {
      var id = new Date().getTime();
      var players = [id + 10];
      games.push({id: id, board: game.new_board(params['size_of_field']), players: players, player: id + 10});
      success(JSON.stringify({id: id, player: players[0]}), res);
    },
    
    '/games/show': function(params, res, games) {
      var game = find_game(games, params['id']);
      if(game.id) {
        success(JSON.stringify({id: game.id, board: game.board}), res);
      } else {
        not_found(JSON.stringify({id: game.id, message: 'Game does not exist.'}), res);
      }
    },
    
    '/games/join': function(params, res, games) {
      var game = find_game(games, params['id']);
      if(game.players.length == 1) {
        game.players.push(game.id - 10);
        success(JSON.stringify({id: game.id, player: game.players[1]}), res);        
      } else {
        forbidden(JSON.stringify({id: game.id, message: 'Game already has two players.'}), res);
      }
    }
  };
  
  function find_game(games, id) {
    return games.reduce(function(acc, current) { if(current.id == id) {acc = current;}; return acc; }, {});
  };
  
  function success(data, res) {
    send_json(data, res, 200);
  };
  
  function forbidden(data, res) {
    send_json(data, res, 403);
  };
  
  function not_found(data, res) {
    send_json(data, res, 404);
  };
  
  function send_json(data, res, code) {
    res.sendHeader(code, {"Content-Type": 'application/json', "Content-Length": data.length });
    res.write(data);
    res.close();    
  }
};