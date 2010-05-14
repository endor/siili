Store = function() {};
Store.prototype = {
  exists: function(key) {
    return (this.get(key) != null);
  },
  set: function(key, value) {
    return window.localStorage.setItem(this._key(key), value);
  },
  get: function(key) {
    return window.localStorage.getItem(this._key(key));
  },
  clear: function(key) {
    window.localStorage.removeItem(this._key(key));;
  },
  _key: function(key) {
    return ['store', 'go.js', key].join('.');
  }
};
