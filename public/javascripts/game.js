$(function() {
  var build_board = function(data) {
    $('#go').html('')
    for(var row in data) {
      if(row.match(/\d+/)) {
        for(col in data[row]) {
          if(col.match(/\d+/)) {
            var id = row + '_' + col
            var class_name = class_name_for_value(data[row][col])
            $('#go').append('<div class="field ' + class_name + '" id="' + id + '"></div>')
          }
        }
      }
    }
  }
  
  var class_name_for_value = function(value) {
    switch(value) {
      case 0:
        return 'empty'; break
      case 1:
        return 'white'; break
      case 2:
        return 'black'; break
    }    
  }
  
  var set_info = function(game) {
    $('#info').html('<h2>Players</h2><ul class="players"><li>' + game.white +
      ',<br />Prisoners: ' + game.prisoners_of_white + '</li></ul>')
    if(game.black)
      $('#info .players').append('<li>' + game.black + ',<br />Prisoners: ' + game.prisoners_of_black + '</li>')
  }
  
  var display_game = function(game) {
    build_board(game.board)
    $('h1').html('siili - ' + game.identifier)
    set_info(game)
    $('#go').show()
    $('#info').show()
    $('#go').data('identifier', game.identifier)
  }
  
  $('.new_game').click(function() {
    siili.post('/games', {board_size: 9}, function(game) {
      display_game(game)
      siili.display_games()
    }, siili.flash_error)
    return false
  })
  
  $('a.join_game').live('click', function() {
    $.facebox($('#join').html())
    return false
  })
  
  $('input.join_game').live('click', function() {
    var game_id = $('#facebox .game').val()
    siili.put('/games/' + game_id, {}, function(game) {
      $(document).trigger('close.facebox')
      display_game(game)
    }, function(error) {
      $('#facebox form').append('<div class="error">' + error.responseText + '</div>')
    })
    return false
  })
  
  $('a.game').live('click', function() {
    var id = $(this).text()
    siili.get('/games/' + id, {}, function(game) {
      display_game(game)
    })
    return false
  })
  
  $('.field.empty').live('click', function() {
    var id = $(this).attr('id').split('_')
    var params = { x: id[0], y: id[1], game: $('#go').data('identifier') }
    
    siili.post('/stones', params, function(game) {
      var game = JSON.parse(game)
      display_game(game)
    }, siili.flash_error)
  })
})