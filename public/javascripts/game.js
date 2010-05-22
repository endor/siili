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
    $('#info').html('<h2>Players</h2><ul class="players"><li>' + game.white + '</li></ul>')
    if(game.black)
      $('#info .players').append('<li>' + game.black + '</li>')
  }
  
  var display_game = function(game) {
    build_board(game.board)
    $('h1').html('siili - ' + game.identifier)
    set_info(game)
    $('#go').show()
    $('#info').show()
    $('#games').hide()
  }
  
  $('.new_game').click(function() {
    post('/games', {board_size: 9}, function(game) {
      display_game(game)
    }, flash_error)
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
        $('#games').append('<li class="game"><a href="#" class="game">' + this.identifier + '</a></li>')        
      })
    }, flash_error)
    return false
  })
  
  $('a.game').live('click', function() {
    var id = $(this).text()
    get('/games/' + id, {}, function(game) {
      var game = JSON.parse(game)
      display_game(game)
      $('#go').data('color', game.color)
      $('#go').data('identifier', game.identifier)
    })
    return false
  })
})