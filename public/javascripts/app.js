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
  
  siili.display_games = function() {
    var $games = $('#games')
    siili.get('/games', {}, function(games) {
      $games.html('')
      $.each(games, function() {
        $games.append('<li class="game"><a href="#" class="game">' + this.identifier + '</a></li>')        
      })
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