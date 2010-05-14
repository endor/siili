require.paths.unshift(__dirname + '/../express/lib')
require('express')
require('express/plugins')
var sys = require('sys')
var UserService = require('./models/user').UserService;

configure(function() {
  use(Logger)
  use(Static)
  set('root', __dirname)
})

var User = new UserService();

get('/', function() {
  this.sendfile(__dirname + '/public/index.html')
})

post('/users', function(){
  var name = this.params.post.user
  var password = this.params.post.password
  var user = User.find_by_name(name)
  
  if(user && user.password == password) {
    this.respond(400, 'User already registered.')
  } else {
    User.save({name: name, password: password})
    this.respond(200)
  }
  // this.contentType('json')
  // this.halt(200, JSON.stringify({}))
})

run()