describe 'Stone'
  before_each
    Game = new GameService(), User = new UserService()
    
    black = { identifier: '456' }
    white = { identifier: '123' }
    game = Game.save({board_size: 9, white: white, black: black})
  end
  
  describe 'validate'
    it 'should return an error if there\'s already a stone on the field'
      stone = new Stone({ game: game, user: white, x: 0, y: 0 })
      stone.set()
      stone = new Stone({ game: game, user: black, x: 0, y: 0 })
      errors = stone.validate()
      errors[0].should.equal 'There\'s already a stone on this field.'
    end
    
    it 'should return an error if the same player tries to set again'
      stone = new Stone({ game: game, user: white, x: 0, y: 0 })
      stone.set()
      stone = new Stone({ game: game, user: white, x: 0, y: 1 })
      errors = stone.validate()
      errors[0].should.equal 'It\'s not your turn.'
    end
  end
  
  describe 'set'
    it 'should not remove undead enemy stones'
      stone = new Stone({ game: game, user: white, x: 0, y: 0 })
      stone.set()
      stone = new Stone({ game: game, user: black, x: 0, y: 1 })
      stone.set()
      game.board[0][0].should.equal 1
    end
  
    it 'should remove dead enemy stones from a corner'
      /*
      |--------
      | w b
      | b w
      |
      */
      [
        { user: white, x: 0, y: 0 },
        { user: black, x: 0, y: 1 },
        { user: white, x: 1, y: 1 },
        { user: black, x: 1, y: 0 }
      ].forEach(function(move) {
        stone = new Stone({ game: game, user: move.user, x: move.x, y: move.y })
        stone.set()
      });
      
      game.board[0][0].should.equal 0
    end
    
    it 'should remove dead enemy stones from the middle'
      /*
        |------------
        |
        |   w b
        | w b w b b
        | w b w
        |   w
        |
      */
      [
        { user: white, x: 1, y: 1 },
        { user: black, x: 1, y: 2 },
        { user: white, x: 0, y: 2 },
        { user: black, x: 1, y: 3 },
        { user: white, x: 0, y: 3 },
        { user: black, x: 2, y: 1 },
        { user: white, x: 1, y: 4 },
        { user: black, x: 3, y: 2 },
        { user: white, x: 2, y: 3 },
        { user: black, x: 4, y: 2 },
        { user: white, x: 2, y: 2 }
      ].forEach(function(move) {
        stone = new Stone({ game: game, user: move.user, x: move.x, y: move.y })
        stone.set()
      })
      game.board[1][2].should.equal 0
      game.board[1][3].should.equal 0
    end
    
    it 'should remove complex dead stones'
      /*
        |------------
        |   w w w   b
        | w b b b w b 
        | w b w b w b
        | w b b b w b
        |   w w w
        |
      */
      [
        { user: white, x: 0, y: 1 },
        { user: black, x: 1, y: 1 },
        { user: white, x: 0, y: 2 },
        { user: black, x: 1, y: 2 },
        { user: white, x: 0, y: 3 },
        { user: black, x: 1, y: 3 },
        { user: white, x: 1, y: 0 },
        { user: black, x: 2, y: 1 },
        { user: white, x: 2, y: 0 },
        { user: black, x: 3, y: 1 },
        { user: white, x: 3, y: 0 },
        { user: black, x: 3, y: 2 },
        { user: white, x: 4, y: 1 },
        { user: black, x: 3, y: 3 },
        { user: white, x: 4, y: 2 },
        { user: black, x: 2, y: 3 },
        { user: white, x: 4, y: 3 },
        { user: black, x: 5, y: 0 },
        { user: white, x: 1, y: 4 },
        { user: black, x: 5, y: 1 },
        { user: white, x: 2, y: 4 },
        { user: black, x: 5, y: 2 },
        { user: white, x: 3, y: 4 },
        { user: black, x: 5, y: 3 },
        { user: white, x: 2, y: 2 }
        
      ].forEach(function(move) {
        stone = new Stone({ game: game, user: move.user, x: move.x, y: move.y })
        stone.set()
      })
      game.board[1][1].should.equal 0
      game.board[3][3].should.equal 0      
    end
  end
end