(function() {
  exports.User = {
    new_to_couchdb: function(user, success, error) {
      user.type = 'user'
      this.db.saveDoc(user, function(_err, ok) {
        if(_err) {
          error(_err)
        } else {
          user._id = ok.id
          user._rev = ok.rev
          success(user)
        }
      })
    },
    
    find_by_name: function(name, success, error) {
      this.db.view('user', 'by_name', { startkey: name, endkey: name + "\u9999", limit: 1 }, function(err, result) {
        if(err) { console.log(err); return }
        if(result.rows.length > 0) { success(result.rows[0].value) } else { error() }        
      })
    },
    
    find: function(id, success, error) {
      this.db.getDoc(id, function(err, result) {
        if(result) { success(result) } else { error() }
      })
    }
  }  
})()