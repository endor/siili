var go = $.sammy('#go', function() {
  this.store = new Sammy.Store({name: 'go.js', type: ['local', 'cookie']});
  this.helpers(exports.GoHelpers);
  
  this.get('#/', function(context) {
    context.current_game = go.store.get('current_game');
    context.size_of_field = 9;

    if(context.current_game) {
      Game.show(context, function(game) {
        $('h1').html('go.js - ' + game.id);
      });
    } else {
      Game.create(context, function(game) {
        context.join_game(context, game.id);
      });
    }
  });
  
  this.get('#/games/new', function(context) {
    $('#go').html('');
    go.store.clear('current_game');
    context.current_game = null;
    context.redirect('#/');
  });
  
  this.get('#/games/join', function(context) {
    var id = $('.join_game_id').val();
    Game.participate(context, id, function(game_id, player_id) {
      context.join_game(context, game_id);
    });
  });
});

$(function() {
  go.run('#/');
});