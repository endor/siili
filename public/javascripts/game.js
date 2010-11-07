$(function() {
  siili.build_board = function(data, element) {
    var class_name_for_value = function(value) {
      switch(value) {
        case 0:
          return 'empty'
        case 1:
          return 'white'
        case 2:
          return 'black'
      }    
    }
    
    element.html('')
    for(var row in data) {
      if(row.match(/\d+/)) {
        for(var col in data[row]) {
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
    var info = $('#info'),
      html = '<h2>Players</h2>' +
        '<ul class="players">' +
          '<li>' + 
            '<span>' + game.white + '</span><br />' +
            'Prisoners: ' + game.prisoners_of_white +
          '</li>' +
        '</ul>'

    info.html(html).append(game.message || '')
    if(game.black) {
      info.find('.players').append('<li><span>' + game.black + '</span><br />Prisoners: ' + game.prisoners_of_black + '</li>')
    }
    info.show()      
  }
  
  var display_game = (function() {
    function minimize(maximized, index, callback) {
      if(callback) { callback() }

      maximized.
        removeClass('playable').
        css({
          '-webkit-transform': 'scale(0.2) translateX(0px) translateY(0px)',
          '-moz-transform': 'scale(0.2) translateX(0px) translateY(0px)',
          '-o-transform': 'scale(0.2) translateX(0px) translateY(0px)',
          'transform': 'scale(0.2) translateX(0px) translateY(0px)'
        }).
        prev().show()
    }

    function maximize(game, index, callback) {
      callback = callback || function() {}
      var $game = $('div.game[data-identifier=\'' + game._id + '\']'),
        $opponent = $('div.opponent[data-identifier=\'' + game._id + '\']'),
        translateY = 180 - ((index % 5) * 100) + 'px',
        translateX = -350 -(Math.floor(index/5) * 100) + 'px'

      $game.
        addClass('playable').
        one('webkitTransitionEnd transitionend oTransitionEnd', callback).
        css({
          '-webkit-transform': 'scale(1) translateX(' + translateX + ') translateY(' + translateY + ')',
          '-moz-transform': 'scale(1) translateX(' + translateX + ') translateY(' + translateY + ')',
          '-o-transform': 'scale(1) translateX(' + translateX + ') translateY(' + translateY + ')',
          'transform': 'scale(1) translateX(' + translateX + ') translateY(' + translateY + ')'
        })
      $opponent.hide()

      setTimeout(callback, 500)
    }

    function show_links(game) {
      if(game.active) { $('#game_links').show() }
    }
    
    return function(game, index) {
      var maximized = $('div.game.playable')
      
      if(maximized.length > 0) {
        minimize(maximized, index, function() {
          $('#game_links').hide()
          $('#info').hide()
        })
      }
      
      maximize(game, index, function() {
        show_links(game)
        set_info(game)
      })
    }
  })()  
  
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
    siili.put('/games/' + game_id, {action: 'join'}, function(game) {
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
    var game_div = $(this).parents('div.game')
    display_game(JSON.parse(game_div.attr('data-game').replace(/'/g, '"')), game_div.attr('data-index'))
    return false
  })
  
  $('.active.playable:not(.ended) .field.empty').live('click', function(evt) {
    var id = $(this).attr('id').split('_'),
      params = { x: id[0], y: id[1], game: $('.game.playable').attr('data-identifier') }
    
    siili.post('/stones', params, function(game) {
      var game_div = $('.game.playable')
      game_div.removeClass('active')
      game_div.find('.board').html('')
      siili.build_board(game.board, game_div.find('.board'))
    }, siili.flash_error)
    
    return false
  })
  
  var game_link_callback = function(action) {
    return function() {
      var game_div = $('.game.playable'),
        id = game_div.attr('data-identifier')

      siili.put('/games/' + id,
        { action: action },
        function(game) {
          set_info(game)
          game_div.removeClass('active')
          if(game.ended) { game_div.addClass('ended') }
          siili.update_game_div_data_attributes(id, game)
        },
        siili.flash_error)

      return false      
    }
  }
  
  $('#game_links .resign').live('click', game_link_callback('resign'))
  $('#game_links .pass').live('click', game_link_callback('pass'))
})