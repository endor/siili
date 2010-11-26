require.paths.unshift('vendor/node-couchdb/lib');

var express = require('express'),
  app = express.createServer(),
  sys = require('sys'),
  couchdb = require('couchdb'),
  couch_client,
  db,
  couch_views = require('./lib/couch_views'),
  Stone = require('./models/stone').Stone,
  User = require('./models/user').User,
  Game = require('./models/game').Game

app.configure(function() {
  app.use(express.methodOverride())
  app.use(express.bodyDecoder())
  app.use(express.logger())
  app.use(app.router)
  app.use(express.staticProvider(__dirname))
  couch_client = couchdb.createClient(5984, 'localhost')
  db = couch_client.db('siili')
  app.db = User.db = Game.db = db
  couch_views.update_views(db)
})

app.put('/update_views', function(req, res) {
  couch_views.update_views(db)
  res.send(201)
})

app.get('/', function(req, res) {
  res.sendfile(__dirname + '/public/index.html')
})

app.post('/users', function(req, res) {
  var name = req.body.name,
    password = req.body.password
    
  User.find_by_name(name, function() {
    res.send('User already registered.', 403)
  }, function() {
    User.new_to_couchdb({ name: name, password: password }, function(user) {
      send_result(res, user)      
    }, function(err) {
      send_error(res, err)
    })
  })
})

app.post('/sessions', function(req, res) {
  var name = req.body.name,
    password = req.body.password,
    wrong_user_password = function() { send_error(res, 'Wrong user/password.', 403) }

  User.find_by_name(name, function(user) {
    if(user.password !== password) {
      wrong_user_password()
    } else {
      send_result(res, user)
    }
  }, wrong_user_password)
})

app.post('/games', function(req, res) {
  var could_not_be_created = function() { send_error(res, 'Game could not be created.', 403) }
  
  User.find(req.body.user, function(user) {
    Game.new_to_couchdb({board_size: req.body.board_size, white: user}, function(game) {
      send_result(res, Game.prepare(game, user))
    }, function(err) {
      send_error(res, err)
    })
  }, could_not_be_created)
})

app.put('/games/:id', function(req, res) {
  var user_or_game_not_found = function() { send_error(res, 'Cannot find user or game.', 400) }  
  
  User.find(req.body.user, function(user) {
    Game.find(req.params.id, function(game) {
      var send_game = function(game) { console.log(Game.prepare(game, user)); send_result(res, Game.prepare(game, user)) },
        send_couch_error = function(err) { send_error(res, err, 403) }
      
      switch(req.body.action) {
        case 'join':
          Game.participate(game, user, send_game, function() {
            send_error(res, 'You cannot join your own game.', 403)
          })
          break
        case 'resign':
          Game.resign(game, user, send_game, send_couch_error)
          break
        case 'pass':
          Game.pass(game, user, send_game, send_couch_error)
          break
      }
    }, user_or_game_not_found)
  }, user_or_game_not_found)
})

var get_games = function(method) {
  return function(req, res) {
    User.find(req.query.user, function(user) {
      Game[method](user, function(games) {
        send_result(res, games.map(function(game) { return Game.prepare(game, user) }))
      }, function() {
        send_result(res, [])
      })
    })
  }
}
app.get('/games', get_games('find_by_user'))
app.get('/open_games', get_games('find_open'))

app.post('/stones', function(req, res) {
  var body = req.body,
    cannot_set_stone = function() { send_error(res, 'Cannot set stone.', 403) }

  User.find(body.user, function(user) {
    Game.find(body.game, function(game) {
      var stone = new Stone({ game: game, user: user, x: parseInt(body.x, 10), y: parseInt(body.y, 10) }),
        errors = stone.validate()
      
      if(errors.length === 0) {
        stone.set(db, function(game) {
          send_result(res, Game.prepare(game, user))          
        })
      } else {
        send_error(res, errors[0], 403)
      }
    }, cannot_set_stone)
  }, cannot_set_stone)
})

function send_result(res, result) {
  res.contentType('json')
  res.send(result, 200)
}

function send_error(res, err, code) {
  err = typeof err === "string" ? err : JSON.stringify(err)
  res.send(err, code || 500)
}

app.listen(3000)