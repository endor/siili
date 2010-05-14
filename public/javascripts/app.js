$(function() {
  $(document).bind('reveal.facebox', function() {
    $('#facebox .footer').remove()
    $('#facebox_overlay').unbind('click')
  })
  
  $.facebox($('#login').html())
  $('#login').remove()
  $('nav').show()
})
