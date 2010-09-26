$(function() {  
  function user_data(form) {
    return {
      name: $('#facebox .' + form + ' input.user').val(),
      password: $('#facebox .' + form + ' input.password').val()
    }
  }
  
  function display_error(error, form) {
    $('#facebox .' + form).append('<div class="error">' + error.responseText + '</div>')
  }
  
  function close_facebox() {
    $(document).trigger('close.facebox')
  }
  
  function login(data) {
    post('/sessions', data, function(user) {
      close_facebox()
      store.set('user', user.identifier)
      $('nav').show()
    }, function(error) {
      display_error(error, 'login_form')
    })
  }
  
  $('.register').live('click', function() {
    var data = user_data('register_form')
    post('/users', data, function() {
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
    store.clear('user')
    window.location.reload()
    return false
  })
})