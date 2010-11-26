describe 'Game'
  before_each
    Game  = exports.Game
    black = { _id: '456', name: 'George' }
    white = { _id: '123', name: 'Clooney' }
    game  = { board_size: 9, white: white, black: black, history: [], prisoners_of_white: 0, prisoners_of_black: 0 }
    game.board = (function(board_size) {
      var board = {}
  
      for(var i = 0; i < board_size; i += 1) {
        board[i] = {}
        for(var j = 0; j < board_size; j += 1) {
          board[i][j] = 0
        }
      }
  
      return board
    })(9)
    Game.db = {saveDoc: function() {}}
  end
  
  describe 'count'
    describe 'japanese counting'
      it 'should be able to count clean areas'
        // | -  -  -  -  -  -  -  -  - |
        // |       w  b                |
        // |       w  b                |
        // |       w  b                |
        // |       w  b                |
        // |       w  b                |
        // |       w  b                |
        // |       w  b                |
        // |       w  b                |
        // |       w  b                |
        // | -  -  -  -  -  -  -  -  - |
        [0,1,2,3,4,5,6,7,8].forEach(function(number) {
          game.board[2][number] = 1
          game.board[3][number] = 2
        })
        game.passed_by = { user: black._id }
        Game.pass(game, white)
        game.result.white.should.eql(18)
        game.result.black.should.eql(45)
        game.result.difference.should.eql(27)
      end
      
      it 'should be able to add prisoners to clean areas'
        // | -  -  -  -  -  -  -  -  - |
        // |    w     w  b             |
        // |       w  w  b             |
        // |       w  b                |
        // |       w  b                |
        // |       w  b                |
        // |       w  b                |
        // |       w  b                |
        // |       w  b                |
        // |       w  b                |
        // | -  -  -  -  -  -  -  -  - |
        // on 2-0 is a taken black stone
        [2,3,4,5,6,7,8].forEach(function(number) {
          game.board[2][number] = 1
          game.board[3][number] = 2
        })
        game.board[3][1] = 1
        game.board[4][1] = 2
        game.board[3][0] = 1
        game.board[4][0] = 2
        game.board[2][1] = 1
        game.board[1][0] = 1
        game.prisoners_of_white = 1
        game.passed_by = { user: black._id }
        Game.pass(game, white)
        game.result.white.should.eql(19)
        game.result.black.should.eql(43)
        game.result.difference.should.eql(24)
      end
    end
  end
  
  describe 'prepare'
    describe 'active when user is white'
      it 'should be true if there is no history yet'
        Game.prepare(game, white).active.should.be_true
      end
    
      it 'should be false if the last move was made by white'
        game.history.push({x: 1, y: 1, _id: white._id, color: 'white'})
        Game.prepare(game, white).active.should.be_false
      end
      
      it 'should be true if the last move was made by black'
        game.history.push({x: 1, y: 1, _id: black._id, color: 'black'})
        Game.prepare(game, white).active.should.be_true
      end
    end
    
    describe 'message'
      it 'should tell me if i resigned'
        game.resigned_by = { user: white._id }
        Game.prepare(game, white).message.should.equal('You resigned.')
      end
  
      it 'should tell me if the other player resigned'
        game.resigned_by = { user: black._id }
        Game.prepare(game, white).message.should.equal('George resigned.')
      end
  
      it 'should tell me if i passed'
        game.passed_by = { user: white._id }
        Game.prepare(game, white).message.should.equal('You passed.')
      end
  
      it 'should tell me if the other player passed'
        game.passed_by = { user: black._id }
        Game.prepare(game, white).message.should.equal('George passed.')
      end
  
      it 'should tell me if I have won'
        game.result = { white: 3, black: 2, difference: 1 }
        Game.prepare(game, white).message.should.equal('You have won by 1.0.')
      end
      
      it 'should tell me if the other player has won'
        game.result = { white: 2, black: 3, difference: 1 }
        Game.prepare(game, white).message.should.equal('George has won by 1.0.')        
      end
      
      it 'should tell me if the game was even'
        game.result = { white: 2, black: 2, difference: 0 }
        Game.prepare(game, white).message.should.equal('The game was even.')
      end
      
      it 'should be null if none of the above is true'
        Game.prepare(game, white).message.should.be_null
      end
    end
  end
end