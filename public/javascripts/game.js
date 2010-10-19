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
    $('#info').html('<h2>Players</h2><ul class="players"><li>' + game.white +
      ',<br />Prisoners: ' + game.prisoners_of_white + '</li></ul>')
    if(game.black)
      $('#info .players').append('<li>' + game.black + ',<br />Prisoners: ' + game.prisoners_of_black + '</li>')
    $('#info').show()
  }
  
  var display_game = function(game, index) {
    function minimize(maximized, index) {
      maximized.
        removeClass('playable').
        css({
          '-webkit-transform': 'scale(0.2) translateX(0px) translateY(0px)',
          '-moz-transform': 'scale(0.2) translateX(0px) translateY(0px)',
          '-o-transform': 'scale(0.2) translateX(0px) translateY(0px)',
          'transform': 'scale(0.2) translateX(0px) translateY(0px)'
        })
    }
    
    function maximize(game, index) {
      var $game = $('div.game[data-identifier=\'' + game._id + '\']'),
        translateY = 180 - ((index % 5) * 100) + 'px',
        translateX = -350 -(Math.floor(index/5) * 100) + 'px'
      
      $game.
        addClass('playable').
        css({
          '-webkit-transform': 'scale(1) translateX(' + translateX + ') translateY(' + translateY + ')',
          '-moz-transform': 'scale(1) translateX(' + translateX + ') translateY(' + translateY + ')',
          '-o-transform': 'scale(1) translateX(' + translateX + ') translateY(' + translateY + ')',
          'transform': 'scale(1) translateX(' + translateX + ') translateY(' + translateY + ')'
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
      siili.display_games(function() {
        display_game(game, $('div.game').length - 1)
      })
    }, siili.flash_error)
    return false
  })
  
  $('a.join_game').live('click', function() {
    $.facebox($('#join').html())
    return false
  })
  
  $('input.join_game').live('click', function() {
    var game_id = $('#facebox .game_id').val()
    siili.put('/games/' + game_id, {}, function(game) {
      $(document).trigger('close.facebox')
      siili.display_games(function() {
        display_game(game, $('div.game').length - 1)
      })
    }, function(error) {
      $('#facebox form').append('<div class="error">' + error.responseText + '</div>')
    })
    return false
  })
  
  $('div.game:not(.playable) a').live('click', function() {
    var game = $(this).parents('div.game')
    display_game(JSON.parse(game.attr('data-game').replace(/'/g, '"')), game.attr('data-index'))
    return false
  })
  
  $('.playable .field.empty').live('click', function(evt) {
    var id = $(this).attr('id').split('_')
    var params = { x: id[0], y: id[1], game: $('.game.playable').attr('data-identifier') }
    
    siili.post('/stones', params, function(game) {
      var game_div = $('.game.playable')
      game_div.removeClass('active')
      game_div.find('.board').html('')
      siili.build_board(game.board, game_div.find('.board'))
    }, siili.flash_error)
  })
})