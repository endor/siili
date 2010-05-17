require.paths.unshift(__dirname + '/../express/lib')
require('express')
require('express/plugins')
var sys = require('sys')
var UserService = require('./models/user').UserService;
var GameService = require('./models/game').GameService;

configure(function() {
  use(MethodOverride)
  use(Logger)
  use(Static)
  set('root', __dirname)
})

var User = new UserService();
var Game = new GameService();

get('/', function() {
  this.sendfile(__dirname + '/public/index.html')
})

post('/users', function() {
  var name = this.params.post.user
  var password = this.params.post.password
  var user = User.find_by_name(name)

  if(user) {
    this.respond(400, 'User already registered.')
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
    this.respond(400, 'Wrong user/password.')
  }
})

post('/games', function() {
  if(this.params.post.user) {
    var user = User.find_by_identifier(this.params.post.user)
    var game = Game.save({board_size: this.params.post.board_size, white: user})

    if(game && user) {
      this.contentType('json')
      this.respond(200, JSON.stringify(game))    
    }
  }
  
  this.respond(400, 'Game could not be created.')
})

put('/games/:id', function() {
  if(this.params.post.user) {
    var user = User.find_by_identifier(this.params.post.user)
    var game = Game.find_by_identifier(this.params.path.id)

    if(game && user) {
      if(game.participate(user)) {
        this.contentType('json')
        this.respond(200, JSON.stringify(game))
      } else {
        this.respond(400, 'You cannot join your own game.')
      }
    }
  }
  
  this.respond(400, 'Game could not be joined.')
})

get('/games', function() {
  if(this.params.get.user) {
    user = User.find_by_identifier(this.params.get.user)
    // TODO: this should be user.games
    games = Game.find_all(user)
    
    if(games && user) {
      this.respond(200, JSON.stringify(games))
    }
  }
  
  this.respond(400, 'You don\'t have any games.')
})

run()