$(function() {
  siili.flash = function(message) {
    $('#flash').html(message).show().delay(2000).fadeOut('slow')
  }

  siili.flash_error = function(error) {
    siili.flash(error.responseText)
  }
  
  var define_route = function(verb) {
    siili[verb] = function(url, data, success, error) {
      if(siili.store.exists('user')) {
        $.extend(data, {user: siili.store.get('user')})
      }

      $.ajax({
        url: url,
        type: verb.toUpperCase(),
        data: data,
        dataType: 'json',
        success: success,
        error: error
      })
    }
  }
  define_route('post')
  define_route('put')
  define_route('get')
  
  siili.update_game_div_data_attributes = function(id, game) {
    var game_div = $('div.game[data-identifier=\'' + id + '\']')
    game_div.attr('data-game', JSON.stringify(game).replace(/"/g, '\''))
    return game_div
  }
  
  siili.display_games = function(callback) {
    $('div.game').remove()
    
    siili.get('/games', {}, function(games) {
      $.each(games, function(index) {
        var id = this._id,
          color = this.color,
          game_template = '' +
            '<div class="game ' + color + '" data-identifier="' + id + '" data-game="" data-index="' + index + '">' +
              '<a href="#">' +
                '<p>' + id + '</p>' + 
                '<div class="board"></div>' +
              '</a>' +
            '</div>'

        $('body').append(game_template)
        var game_div = siili.update_game_div_data_attributes(id, this)
        if(this.active) { game_div.addClass('active') }
        if(this.resigned_by || this.ended) { game_div.addClass('ended') }
        
        siili.build_board(this.board, game_div.find('div.board'))
        
        var left = (550 + Math.floor(index/5) * 100) + 'px',
          top = (-20 + ((index % 5) - 1) * 100) + 'px'

        game_div.css({
          '-webkit-transform': 'scale(0.2)',
          '-o-transform': 'scale(0.2)',
          '-moz-transform': 'scale(0.2)',
          'transform': 'scale(0.2)',
          'left': left,
          'top': top
        })
        setTimeout(function(div) {
          div.addClass('animate')
        }, 100, game_div)
        
        game_div.before('<div class="opponent" data-identifier="' + id + '">' + this.opponent + '</div>')
        $('div.opponent[data-identifier=\'' + id + '\']').css({'top': (parseInt(top, 10) + 130), 'left': (parseInt(left, 10) + 127)})
      })
      
      if(callback) {
        callback()
      }
    }, siili.flash_error)
  }

  $(document).bind('reveal.facebox', function() {
    if($('#facebox #register_user').length > 0) {
      $('#facebox .footer').remove()
      $('#facebox_overlay').unbind('click')
      $(document).unbind('keydown.facebox')
    }
  })
  
  siili.store = new Store()
  
  if(siili.store.exists('user')) {
    $('nav').show()
    siili.display_games()
  } else {
    $.facebox($('#login').html())
    $('#facebox div.form:first').addClass('register_form')
    $('#facebox div.form:last').addClass('login_form')  
  }  
})