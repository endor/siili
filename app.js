var express = require('express'),
  app = express.createServer(),
  sys = require('sys'),
  UserService = require('./models/user').UserService,
  GameService = require('./models/game').GameService,
  Stone = require('./models/stone').Stone

app.configure(function() {
  app.use(express.methodOverride())
  app.use(express.bodyDecoder())
  app.use(express.logger())
  app.use(app.router)
  app.use(express.staticProvider(__dirname))
})

var User = new UserService(),
  Game = new GameService()

app.get('/', function(req, res) {
  res.sendfile(__dirname + '/public/index.html')
})

app.post('/users', function(req, res) {
  var name = req.body.name,
    password = req.body.password,
    user = User.find_by_name(name)
  
  if(user) {
    res.send('User already registered.', 403)
  } else {
    User.save({name: name, password: password})
    res.contentType('json')
    res.send(user, 200)
  }
})

app.post('/sessions', function(req, res) {
  var name = req.body.name,
    password = req.body.password,
    user = User.find_by_name(name)
  
  if(user && user.password == password) {
    res.contentType('json')
    res.send(user, 200)
  } else {
    res.send('Wrong user/password.', 403)
  }
})

app.post('/games', function(req, res) {
  if(req.body.user) {
    var user = User.find_by_identifier(req.body.user),
      game = Game.save({board_size: req.body.board_size, white: user})

    if(game && user) {
      res.contentType('json')
      res.send(game.prepare(user), 200)
    }
  }
  
  res.send('Game could not be created.', 403)
})

app.put('/games/:id', function(req, res) {
  if(req.body.user) {
    var user = User.find_by_identifier(req.body.user),
      game = Game.find_by_identifier(req.params.id)

    if(game && user) {
      if(game.participate(user)) {
        res.contentType('json')
        res.send(JSON.stringify(game.prepare(user)), 200)
      } else {
        res.send('You cannot join your own game.', 403)
      }
    }
  }
  
  res.send('Game could not be joined.', 400)
})

app.get('/games', function(req, res) {
  if(req.query.user) {
    var user = User.find_by_identifier(req.query.user),
      games = Game.find_all_by_user(user),
      result = games || []
    
    res.send(JSON.stringify(result), 200)
  }
})

app.post('/stones', function(req, res) {
  var body = req.body

  if(body.user) {
    var user = User.find_by_identifier(body.user),
      game = Game.find_by_identifier(body.game)
    
    if(game && user) {
      var stone = new Stone({ game: game, user: user, x: parseInt(body.x, 10), y: parseInt(body.y, 10) }),
        errors = stone.validate()
      
      if(errors.length === 0) {
        stone.set()
        res.send(game.prepare(user), 200)
      } else {
        res.send(errors[0], 403)
      }
    }    
  }
  
  res.send('Cannot set stone.', 404)
})

app.listen(3000)