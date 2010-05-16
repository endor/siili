require.paths.unshift(__dirname + '/../express/lib')
require('express')
require('express/plugins')
var sys = require('sys')
var UserService = require('./models/user').UserService;
var GameService = require('./models/game').GameService;

configure(function() {
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
    this.respond(200)
  }
  // this.contentType('json')
  // this.halt(200, JSON.stringify({}))
})

post('/sessions', function() {
  var name = this.params.post.user
  var password = this.params.post.password
  var user = User.find_by_name(name)
  
  if(user && user.password == password) {
    this.respond(200)
  } else {
    this.respond(400, 'Wrong user/password.')
  }
})

post('/games', function() {
  var game = Game.save({board_size: this.params.post.board_size})
  this.contentType('json')
  this.respond(200, JSON.stringify(game))
})

run()