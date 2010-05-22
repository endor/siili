$(function() {
  $('.field').live('click', function() {
    var id = $(this).attr('id').split('_')
    post('/stones', {x: id[0], y: id[1], game: $('#go').data('identifier')}, function() {
      var color = $('#go').data('color')
      $('#' + id.join('_')).removeClass('empty').addClass(color)
    })    
  })
})