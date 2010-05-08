var go = $.sammy('#go', function() {
  var size = 9, element_selector;
  
  this.get('#/', function(context) {
    element_selector = go.element_selector;
    // either get game
    // or draw new one
    new_game(context);
  });
  
  function new_game(context) {
    // register new game
    
    // and draw field
    for(i = 1; i <= size; i++) {
      for(j = 1; j <= size; j++) {
        $(element_selector).append('<div id="' + i + '_' + j + '" class="field"></div>');
      }
    }
  };
  
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