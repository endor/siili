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
      html = '<ul class="players">' +
          '<li class="white">' + 
            '<span>' + game.white + '</span><br />' +
            'Prisoners: ' + game.prisoners_of_white +
          '</li>' +
        '</ul>'

    info.html(html).append(game.message || '')
    if(game.black) {
      info.find('.players').append('<li class="black"><span>' + game.black + '</span><br />Prisoners: ' + game.prisoners_of_black + '</li>')
    }
    info.find('.' + game.color).addClass('me')
    info.show()      
  }
  
  var display_game = function(game, index) {
    $('#open_games').hide()

    var current_game = $('#current_game')
    current_game.html('')
    $('.game').removeClass('current')
    
    if(game) {
      $('.game[data-identifier="' + game._id + '"]').addClass('current')
      siili.build_board(game.board, current_game)
      set_info(game)
      if(game.active) {
        $('#game_links').show()
        $('#current_game').
          addClass('playable ' + game.color).
          data('identifier', game._id)
      }
    }
  }
  
  $('.open_games').click(function() {
    display_game(null, null)
    siili.get('/open_games', {}, function(games) {
      var open_games = $('#open_games')
      open_games.html('')
      
      games.forEach(function(game) {
        open_games.append('' +
          '<li class="open_game">' +
            game.opponent +
            '<span>' + game.size + 'x' + game.size + '</span>' +
            '<br /><a href="#" class="join_open_game" data-identifier="' + game._id + '">join</a>' +
          '</li>'
        )
      })
      
      open_games.show()
      $('#info').hide()
    })
  })
  
  $('.join_open_game').live('click', function() {
    join_game($(this).attr('data-identifier'), $(this))
    return false
  })
  
  $('.new_game').click(function() {
    siili.post('/games', {board_size: 9}, function(game) {
      siili.display_games()
    }, siili.flash_error)
    return false
  })
  
  $('.join_game').click(function() {
    $.facebox($('#join').html())
    return false
  })
  
  var join_game = function(game_id, form) {
    siili.put('/games/' + game_id, {action: 'join'}, function(game) {
      $(document).trigger('close.facebox')
      siili.display_games(function() {
        display_game(game, $('div.game').length - 1)
      })
    }, function(error) {
      form.append('<div class="error">' + error.responseText + '</div>')
    })    
  }
  
  $('input.join_game').live('click', function() {
    join_game($('#facebox .game_id').val(), $('#facebox form'))
    return false
  })
  
  $('.game').live('click', function() {
    var game = JSON.parse($(this).attr('data-game').replace(/'/g, '"'))
    display_game(game)
  })
  
  $('#current_game.playable .field.empty').live('click', function(evt) {
    var id = $(this).attr('id').split('_'),
      params = { x: id[0], y: id[1], game: $('#current_game').data('identifier') },
      current_game = $('#current_game'),
      game_li = $('.game[data-identifier="' + id + '"]')
    
    siili.post('/stones', params, function(game) {
      current_game.
        removeClass().
        html('')
      $('#game_links').hide()
      game_li.removeClass('active')
      siili.build_board(game.board, current_game)
    }, siili.flash_error)
    
    return false
  })
  
  var game_link_callback = function(action) {
    return function() {
      var current_game = $('#current_game'),
        id = current_game.data('identifier'),
        game_li = $('.game[data-identifier="' + id + '"]')

      siili.put('/games/' + id,
        { action: action },
        function(game) {
          set_info(game)
          current_game.removeClass('playable')
          game_li.removeClass('active')
          if(game.ended) { game_li.addClass('ended') }          
          siili.update_game_data_attributes(id, game)
        },
        siili.flash_error)

      return false      
    }
  }
  
  $('#game_links .resign').live('click', game_link_callback('resign'))
  $('#game_links .pass').live('click', game_link_callback('pass'))
})