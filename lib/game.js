var sys = require('sys');

exports.game = function() {
  return {
    new_board: function(size) {
      var board = {};
      for(i = 1; i <= size; i++) {
        board[i] = {};
        for(j = 1; j <= size; j++) {
          board[i][j] = 0;
        }
      }
      return board;
    }
  };
};