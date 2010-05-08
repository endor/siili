var sys = require('sys');

exports.actions = function() {
  var game = require('./game').game();

  return {
    '/games/new': function(params, res, games) {
      var id = new Date().getTime();
      var players = [id + 10, id - 10];
      games.push({id: id, board: game.new_board(params['size_of_field']), players: players, player: id + 10});
      send_json(JSON.stringify({id: id, player: players[0]}), res);
    },
    
    '/games/show': function(params, res, games) {
      var id = params['id'];
      var game = games.reduce(function(acc, current) { if(current.id == id) {acc = current;}; return acc; }, {});
      send_json(JSON.stringify({id: game.id, board: game.board}), res);
    }
    
    // '/projects': function(params, res) {
    //   var data_collector = create_data_collector(params['accounts'].length, function(datas) {
    //     send_json(JSON.stringify(join_json_arrays(datas)), res);
    //   });
    //   params['accounts'].forEach(function(account) {
    //     var subdomain = account.split('|')[0],
    //       api_key = account.split('|')[1];
    //     mite_client.projects(subdomain, api_key, data_collector.collector_callback(function(data) {
    //       var json = JSON.parse(data);
    //       var projects = json.map(function(item) {
    //         var project = item['project'];
    //         project['subdomain'] = subdomain;
    //         project['api_key'] = api_key;
    //         return project;
    //       });
    //       return JSON.stringify(projects);
    //     }));
    //   });
    // 
    // },
    // '/time_entries': function(params, res) {
    //   var data_collector = create_data_collector(params['projects'].length, function(datas) {
    //     send_json(JSON.stringify(join_json_arrays(datas)), res);
    //   });
    //   collect_time_entries(params, data_collector);
    // },
    // '/time_entries.csv': function(params, res) {
    //   var data_collector = create_data_collector(params['projects'].length, function(datas) {
    //     var entries = join_json_arrays(datas);
    //     var data = 'Project;Service;Minutes;User;Date;Note;Revenue\n' + entries.map(function(e) {
    //       return [e['project_name'], e['service_name'], e['minutes'], e['user_name'], e['date_at'], e['note'], e['revenue']].join(';');
    //     }).join('\n');
    //     res.sendHeader(200, {"Content-Type": 'text/csv', "Content-Length": data.length });
    //     res.write(data);
    //     res.close();
    //   });
    //   collect_time_entries(params, data_collector);
    // }
  };
  
  function send_json(data, res) {
    res.sendHeader(200, {"Content-Type": 'application/json', "Content-Length": data.length });
    res.write(data);
    res.close();
  };
};