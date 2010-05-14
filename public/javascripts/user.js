$(function() {
  $('.register').live('click' ,function() {
    var user = $('.register_form input.user').val();
    var password = $('.register_form input.password').val();
    
    $.ajax({
      url: '/users',
      type: 'POST',
      data: {user: user, password: password},
      success: function() {
        $(document).trigger('close.facebox')
      },
      error: function(error) {
        $('#facebox .error').html(error.responseText).show()
      }
    })
    return false
  })
})