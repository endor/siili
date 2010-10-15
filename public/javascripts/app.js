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
  
  siili.display_games = function(callback) {
    $('div.game').remove()
    
    siili.get('/games', {}, function(games) {
      $.each(games, function(index) {
        var id = this.identifier,
          data = JSON.stringify(this).replace(/"/g, '\''),
          game_template = '' +
            '<div class="game" data-identifier="' + id + '" data-game="' + data + '" data-index="' + index + '">' +
              '<a href="#">' +
                '<p>' + id + '</p>' + 
                '<div class="board"></div>' +
              '</a>' +
            '</div>'

        $('body').append(game_template)
        var game_div = $('div.game[data-identifier=\'' + id + '\']')

        siili.build_board(this.board, game_div.find('div.board'))
        game_div.css({
          '-webkit-transform': 'scale(0.2)',
          'left': '600px',
          'top': (30 + ((index - 1) * 100)) + 'px'
        })
        setTimeout(function(div) {
          div.addClass('animate')
        }, 100, game_div)
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