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
  
  siili.update_game_data_attributes = function(id, game) {
    var game_li = $('li.game[data-identifier=\'' + id + '\']')
    game_li.attr('data-game', JSON.stringify(game).replace(/"/g, '\''))
    return game_li
  }
  
  siili.display_games = function(callback) {
    $('#games').html('')
    
    siili.get('/games', {}, function(games) {
      games.forEach(function(game, index) {
        $('#games').append('<li class="game ' + game.color + '" data-identifier="' + game._id + '" data-game="" data-index="' + index + '">' +
          game._id.slice(-7) + ', opponent: ' + game.opponent +
        '</li>')

        var game_list_item = siili.update_game_data_attributes(game._id, game)
        if(game.active) { game_list_item.addClass('active') }
        if(game.resigned_by || game.ended) { game_list_item.addClass('ended') }
      })
      
      if(callback) { callback() }
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