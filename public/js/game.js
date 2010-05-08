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
    $.get('/games/show', {id: context.current_game}, function(game) {
      callback(game);
      
      $.each(game.board, function() {
        var row = this;
        $.each(row, function() {
          var col = this;
          $(go.element_selector).append('<div id="' + row + '_' + col + '" class="field"></div>');
        });
      });
    });
  }
};