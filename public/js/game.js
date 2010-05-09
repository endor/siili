var Game = {
  create: function(context, callback) {
    $.get('/games/new', {size_of_field: context.size_of_field}, function(game) {
      callback(game);
    });

    for(i = 1; i <= context.size_of_field; i++) {
      for(j = 1; j <= context.size_of_field; j++) {
        $(go.element_selector).append('<div id="' + i + '_' + j + '" class="field"></div>');
      }
    }
  },

  show: function(context, callback) {
    $.ajax({
      type: 'GET',
      url: '/games/show',
      data: 'id=' + context.current_game,
      success: function(game) {
        callback(game);

        $.each(game.board, function() {
          var row = this;
          $.each(row, function() {
            var col = this;
            $(go.element_selector).append('<div id="' + row + '_' + col + '" class="field"></div>');
          });
        });        
      },
      error: function(error) {
        Game.handle_error(context, error, '#/games/new', ' Creating new game.');
      }
    });
  },
  
  participate: function(context, id, callback) {
    var show_url = '#/';
    $.ajax({
      type: 'GET',
      url: '/games/join',
      data: 'id=' + id,
      success: function(player) {
        callback(id, player);
        context.flash('Successfully joined the game ' + id);
        context.redirect(show_url);
      },
      error: function(error) {
        Game.handle_error(context, error, show_url);
      }
    });
  },
  
  handle_error: function(context, error, redirect_url, additional_message) {
    context.flash(JSON.parse(error.responseText).message + (additional_message ? additional_message : ''));
    context.redirect(redirect_url);
  }
};