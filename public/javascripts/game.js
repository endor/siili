$(function() {
  var build_board = function(data) {
    $('#go').html('')
    for(var row in data) {
      if(row.match(/\d+/)) {
        for(col in data[row]) {
          if(col.match(/\d+/)) {
            id = row + '_' + col
            $('#go').append('<div class="field" id="' + id + '"></div>')
          }
        }
      }
    }
  }
  
  $('.new_game').click(function() {
    post('/games', {board_size: 9}, function(game) {
      build_board(game.board)
    }, function() {
      flash('Game could not be created.')
    })
    return false
  })
})