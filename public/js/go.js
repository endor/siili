var go = $.sammy('#go', function() {
  this.store = new Sammy.Store({name: 'go.js', type: ['local', 'cookie']});
  this.helpers(exports.GoHelpers);
  
  this.get('#/', function(context) {
    context.current_game = go.store.get('current_game');
    context.size_of_field = 9;

    if(context.current_game) {
      Game.show(context, function(game) {
        $('h1').html('go.js - ' + game.id);
      });
    } else {
      Game.create(context, function(game) {
        context.current_game = game.id;
        go.store.set('current_game', context.current_game);
        $('h1').html('go.js - ' + game.id);
      });
    }
  });
  
  this.get('#/games/new', function(context) {
    $('#go').html('');
    go.store.clear('current_game');
    context.current_game = null;
    context.redirect('#/');
  });
  
  
  // this.get('#/projects', function(context) {
  //   if(context.params['accounts']) {
  //     $.get('/projects', {accounts: context.params['accounts']},
  //       function(projects) {
  //         context.projects = projects.map(function(project) {
  //           return {id: project['id'], api_key: project['api_key'],
  //             subdomain: project['subdomain'], name: project['name']};
  //         });
  //         context.partial('templates/projects/index.ms', function(html) {
  //           $('#projects').html(html);
  //         });
  //       }
  //     );
  //   } else {
  //     context.flash('You did not choose any accounts.');
  //   };
  // });
});

$(function() {
  go.run('#/');
});