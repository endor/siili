$(function() {
  siili.build_board = function(data, element) {
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
    
    element.html('')
    for(var row in data) {
      if(row.match(/\d+/)) {
        for(col in data[row]) {
          if(col.match(/\d+/)) {
            var id = row + '_' + col
            var class_name = class_name_for_value(data[row][col])
            element.append('<div class="field ' + class_name + '" id="' + id + '"></div>')
          }
        }
      }
    }
  }
  
  var set_info = function(game) {
    $('#info').html('<h2>Players</h2><ul class="players"><li>' + game.white.name +
      ',<br />Prisoners: ' + game.prisoners_of_white + '</li></ul>')
    if(game.black)
      $('#info .players').append('<li>' + game.black.name + ',<br />Prisoners: ' + game.prisoners_of_black + '</li>')
    $('#info').show()
  }
  
  var display_game = function(game, index) {
    function minimize(maximized, index) {
      maximized.
        removeClass('playable').
        css({
          '-webkit-transform': 'scale(0.2) translateX(0px) translateY(0px)'
        })
    }
    
    function maximize(game, index) {
      var $game = $('div.game[data-identifier=\'' + game.identifier + '\']'),
        translateY = 120 - (index * 100)

      $game.
        addClass('playable').
        css({
          '-webkit-transform': 'scale(1) translateX(-400px) translateY(' + translateY + 'px)'
        })      
    }
    
    var maximized = $('div.game.playable')
    if(maximized.length > 0) {
      minimize(maximized, index)
    }
    maximize(game, index)
    set_info(game)
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
  
  $('div.game a').live('click', function() {
    var game = $(this).parents('div.game')
    display_game(JSON.parse(game.attr('data-game').replace(/'/g, '"')), game.attr('data-index'))
    return false
  })
  
  $('.playable .field.empty').live('click', function() {
    var id = $(this).attr('id').split('_')
    var params = { x: id[0], y: id[1], game: $('#go').data('identifier') }
    
    siili.post('/stones', params, function(game) {
      display_game(game)
    }, siili.flash_error)
  })
})