describe 'Game'
  before_each
    Game = exports.Game
    black = { _id: '456' }
    white = { _id: '123' }
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
  end

end