describe 'Game'
  before_each
    Game = exports.Game
    black = { _id: '456', name: 'George' }
    white = { _id: '123', name: 'Clooney' }
    game = {board_size: 9, white: white, black: black, history: [], prisoners_of_white: 0, prisoners_of_black: 0}
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

      it 'should tell me if the game ended'
        game.ended = true
        Game.prepare(game, white).message.should.equal('Game ended.')
      end
      
      it 'should be null if none of the above is true'
        Game.prepare(game, white).message.should.be_null
      end
    end
  end
end