var sys = require('sys');

var design_docs = {
  user: {
    views: {
      by_name: {
        map: function(doc) {
          if(doc.type === 'user') {
            emit(doc.name, doc)
          }
        }        
      }
    }
  },
  game: {
    views: {
      by_user_id: {
        map: function(doc) {
          if(doc.type === 'game') {
            doc.white && emit(doc.white._id, doc)
            doc.black && emit(doc.black._id, doc)
          }
        }
      }
    }    
  }
}

exports.update_views = function(db) {
  for(name in design_docs) {
    (function(name) {
      db.getDoc('_design/' + name, function(err, old_design_doc) {
        if(old_design_doc) {
          design_docs[name]._id = old_design_doc._id
          design_docs[name]._rev = old_design_doc._rev
        }
        db.saveDesign(name, design_docs[name], function(_err, res) {
          if(_err) { console.log(_err, res) }
        })
      })      
    })(name)
  }
}