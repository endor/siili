$(function() {
  var build_board = function(data) {
    $('#go').html('')
    for(var row in data) {
      if(row.match(/\d+/)) {
        for(col in data[row]) {
          if(col.match(/\d+/)) {
            id = row + '_' + col
            $('#go').append('<div class="field empty" id="' + id + '"></div>')
          }
        }
      }
    }
  }
  
  var set_info = function(game) {
    $('#info').html('<h2>Players</h2><ul class="players"><li>' + game.white.name + '</li></ul>')
    if(game.black) {
      $('#info .players').append('<li>' + game.black.name + '</li>')
    }
  }
  
  var display_game = function(game) {
    build_board(game.board)
    $('h1').html('siili - ' + game.identifier)
    set_info(game)
    $('#go').show()
    $('#games').hide()
  }
  
  $('.new_game').click(function() {
    post('/games', {board_size: 9}, function(game) {
      display_game(game)
    }, function(error) {
      flash(error.responseText)
    })
    return false
  })
  
  $('a.join_game').live('click', function() {
    $.facebox($('#join').html())
    return false
  })
  
  $('input.join_game').live('click', function() {
    var game_id = $('#facebox .game').val()
    put('/games/' + game_id, {}, function(game) {
      $(document).trigger('close.facebox')
      display_game(game)
    }, function(error) {
      $('#facebox form').append('<div class="error">' + error.responseText + '</div>')
    })
    return false
  })
  
  $('.my_games').live('click', function() {
    get('/games', {}, function(games) {
      $('#go').hide()
      $('#info').hide()
      $('h1').html('siili')
      $('#games').html('').show()
      $.each(JSON.parse(games), function() {
        $('#games').append('<li class="game">' + this.identifier + '</li>')        
      })
    }, function(error) {
      flash(error.responseText)
    })
    return false
  })
})