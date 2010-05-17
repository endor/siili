$(function() {
  flash = function(message) {
    $('#flash').html(message).show().delay(2000).fadeOut('slow');
  }
  
  var define_route = function(verb) {
    window[verb] = function(url, data, success, error) {
      if(store.exists('user')) {
        $.extend(data, {user: store.get('user')})
      }

      $.ajax({
        url: url,
        type: verb.toUpperCase(),
        data: data,
        success: success,
        error: error
      })
    }
  }
  define_route('post')
  define_route('put')

  function show_login_form() {
    $.facebox($('#login').html())
    $('#facebox div.form:first').addClass('register_form')
    $('#facebox div.form:last').addClass('login_form')  
  }

  $(document).bind('reveal.facebox', function() {
    if($('#facebox #register_user').length > 0) {
      $('#facebox .footer').remove()
      $('#facebox_overlay').unbind('click')
      $(document).unbind('keydown.facebox')
    }
  })
  
  store = new Store();
  
  if(store.exists('user')) {
    $('nav').show()
  } else {
    show_login_form()
  }  
})