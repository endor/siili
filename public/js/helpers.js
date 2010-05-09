exports.GoHelpers = {
  flash: function(message) {
    $('#flash').text(message).show().delay(2000).fadeOut('slow');
  },
  
  join_game: function(context, game_id) {
    context.current_game = game_id;
    go.store.set('current_game', context.current_game);
    $('h1').html('go.js - ' + game_id);
  }
};