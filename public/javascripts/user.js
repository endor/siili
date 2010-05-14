$(function() {  
  function user_data(form) {
    return {
      user: $('#facebox .' + form + ' input.user').val(),
      password: $('#facebox .' + form + ' input.password').val()
    }
  }
  
  function display_error(error, form) {
    $('#facebox .' + form + ' .error').html(error.responseText).show()
  }
  
  function close_facebox() {
    $(document).trigger('close.facebox')
  }
  
  function login(data) {
    $.ajax({
      url: '/sessions',
      type: 'POST',
      data: data,
      success: function() {
        close_facebox()
        store.set('user', user_data().user)
        $('nav').show()
      },
      error: function(error) { display_error(error, 'login_form') }
    })
  }
  
  $('.register').click(function() {
    var data = user_data('register_form')
    $.ajax({
      url: '/users',
      type: 'POST',
      data: data,
      success: function() {
        login(data)
      },
      error: function(error) { display_error(error, 'register_form') }
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