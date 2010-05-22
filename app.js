require.paths.unshift(__dirname + '/../express/lib')
require('express')
require('express/plugins')

var sys = require('sys'),
    UserService = require('./models/user').UserService,
    GameService = require('./models/game').GameService

configure(function() {
  use(MethodOverride)
  use(Logger)
  use(Static)
  set('root', __dirname)
})

var User = new UserService()
var Game = new GameService()

get('/', function() {
  this.sendfile(__dirname + '/public/index.html')
})

post('/users', function() {
  var name = this.params.post.user
  var password = this.params.post.password
  var user = User.find_by_name(name)

  if(user) {
    this.respond(403, 'User already registered.')
  } else {
    User.save({name: name, password: password})
    
    this.respond(200, JSON.stringify(user))
  }
})

post('/sessions', function() {
  var name = this.params.post.user
  var password = this.params.post.password
  var user = User.find_by_name(name)
  
  if(user && user.password == password) {
    this.contentType('json')
    this.respond(200, JSON.stringify(user))
  } else {
    this.respond(403, 'Wrong user/password.')
  }
})

post('/games', function() {
  if(this.params.post.user) {
    var user = User.find_by_identifier(this.params.post.user)
    var game = Game.save({board_size: this.params.post.board_size, white: user})

    if(game && user) {
      this.contentType('json')
      this.respond(200, JSON.stringify(game.prepare(user)))    
    }
  }
  
  this.respond(403, 'Game could not be created.')
})

put('/games/:id', function() {
  if(this.params.post.user) {
    var user = User.find_by_identifier(this.params.post.user)
    var game = Game.find_by_identifier(this.params.path.id)

    if(game && user) {
      if(game.participate(user)) {
        this.contentType('json')
        this.respond(200, JSON.stringify(game.prepare(user)))
      } else {
        this.respond(403, 'You cannot join your own game.')
      }
    }
  }
  
  this.respond(400, 'Game could not be joined.')
})

get('/games', function() {
  if(this.params.get.user) {
    var user = User.find_by_identifier(this.params.get.user)
    var games = Game.find_all_by_user(user)
    
    if(games)
      this.respond(200, JSON.stringify(games))
  }
  
  this.respond(404, 'You don\'t have any games.')
})

get('/games/:id', function() {
  if(this.params.get.user) {
    var user = User.find_by_identifier(this.params.get.user)
    var game = Game.find_by_identifier(this.params.path.id)

    if(game && user) {
      sys.puts(sys.inspect(game.prepare(user)))
      this.respond(200, JSON.stringify(game.prepare(user)))
    }
  }
  
  this.respond(404, 'No such game.')
})

post('/stones', function() {
  if(this.params.post.user) {
    var user = User.find_by_identifier(this.params.post.user)
    var game = Game.find_by_identifier(this.params.post.game)
    
    if(game && user) {
      if(game.set_stone(user, this.params.post.x, this.params.post.y)) {
        this.respond(200, 'Stone set successfully.')
      } else {
        this.respond(403, 'You cannot set this stone.')
      }
    }
    
  }
  
  this.respond(404, '')
})

run()