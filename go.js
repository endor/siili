var GoGame = function($, board, options) {
  var gogame = {};
  var size = options['size'] || 9;
  
  gogame.draw = function() {
    for(i = 1; i <= size; i++) {
      for(j = 1; j <= size; j++) {
        var id = i + '-' + j;
        var field = '<div class="field" id="' + id + '"></div>';
        board.append(field);
      }
      board.find('.field:last').addClass('last').prevAll('.field:eq(' + (size-2) + ')').addClass('first');
    }
  };
  
  gogame.set_stone = function(field) {
    $(field).addClass('black');
  };
  
  return gogame;
};

$.fn.gogame = function() {
  gogame = GoGame($, this, {});
  
  this.html(gogame.draw());
  
  this.find('.field').click(function() {
    gogame.set_stone(this);
  });
  
  return gogame;
};

$(function() {
  $('.board').gogame();
});