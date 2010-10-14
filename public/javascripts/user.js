$(function() {  
  var user_data = function(form) {
    return {
      name: $('#facebox .' + form + ' input.user').val(),
      password: $('#facebox .' + form + ' input.password').val()
    }
  }
  
  var display_error = function(error, form) {
    $('#facebox .' + form).append('<div class="error">' + error.responseText + '</div>')
  }
  
  var close_facebox = function() {
    $(document).trigger('close.facebox')
  }
  
  var login = function(data) {
    siili.post('/sessions', data, function(user) {
      close_facebox()
      siili.store.set('user', user.identifier)
      siili.display_games()
      $('nav').show()
    }, function(error) {
      display_error(error, 'login_form')
    })
  }
  
  $('.register').live('click', function() {
    var data = user_data('register_form')
    siili.post('/users', data, function() {
      login(data)
    }, function(error) {
      display_error(error, 'register_form')
    })
    return false
  })
  
  $('.login').click(function() {
    login(user_data('login_form'))
    return false    
  })
  
  $('.logout').click(function() {
    siili.store.clear('user')
    window.location.reload()
    return false
  })
})