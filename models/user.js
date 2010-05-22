var sys = require('sys')

UserService = function() {}
UserService.prototype.data = []

var define_find_by = function(attribute) {
  UserService.prototype['find_by_' + attribute] = function(attr) {
    var result = null
    for(var i = 0; i < this.data.length; i++) {
      if(this.data[i][attribute] == attr) {
        result = this.data[i]
        break
      }
    }
    return result    
  }  
}
define_find_by('name')
define_find_by('identifier')

UserService.prototype.build_id = function() {
  return new Date().getTime()
}

UserService.prototype.save = function(user) {
  user.identifier = this.build_id()
  
  this.data[this.data.length] = user
  return true
}

exports.UserService = UserService