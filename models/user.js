UserService = function(){};
UserService.prototype.data = [];

UserService.prototype.find_by_name = function(name, callback) {
  var result = null;
  for(var i = 0; i < this.data.length; i++) {
    if(this.data[i].name == name) {
      result = this.data[i];
      break;
    }
  }
  if(callback) {
    callback(null, result);
  } else {
    return result;
  }
};

UserService.prototype.save = function(user, callback) {
  this.data[this.data.length] = user;

  if(callback) {
    callback(null, users);
  } else {
    return true;
  }
};

exports.UserService = UserService;