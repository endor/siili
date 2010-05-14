$(function() {
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
