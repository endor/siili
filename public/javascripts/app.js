$(function() {
  flash = function(message) {
    $('#flash').html(message).show().delay(2000).fadeOut('slow');
  }
  
  post = function(url, data, success, error) {
    if(store.exists('user')) {
      $.extend(data, {user: store.get('user')})
    }
    
    $.ajax({
      url: url,
      type: 'POST',
      data: data,
      success: success,
      error: error
    })
  }
  
  $(document).bind('reveal.facebox', function() {
    $('#facebox .footer').remove()
    $('#facebox_overlay').unbind('click')
  })
  
  store = new Store();
  
  if(store.exists('user')) {
    $('nav').show()
  } else {
    $.facebox($('#login').html())
  }  
})