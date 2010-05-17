//
// Taken from sammy.js: http://github.com/quirkey/sammy
//

Store = function() {};
if(('localStorage' in window) && (window.location.protocol != 'file:')) {
  Store.prototype = {
    exists: function(key) {
      return (this.get(key) != null)
    },
    set: function(key, value) {
      return window.localStorage.setItem(this._key(key), value)
    },
    get: function(key) {
      return window.localStorage.getItem(this._key(key))
    },
    clear: function(key) {
      window.localStorage.removeItem(this._key(key))
    },
    _key: function(key) {
      return ['store', 'siili', key].join('.')
    }
  }  
} else {
  Store.prototype = {
    exists: function(key) {
      return (this.get(key) != null)
    },
    set: function(key, value) {
      return this._setCookie(key, value)
    },
    get: function(key) {
      return this._getCookie(key)
    },
    clear: function(key) {
      this._setCookie(key, "", -1)
    },
    _key: function(key) {
      return ['store', 'siili', key].join('.')
    },
    _getCookie: function(key) {
      var escaped = this._key(key).replace(/(\.|\*|\(|\)|\[|\])/g, '\\$1')
      var match = document.cookie.match("(^|;\\s)" + escaped + "=([^;]*)(;|$)")
      return (match ? match[2] : null)
    },
    _setCookie: function(key, value, expires) {
      if (!expires) { expires = ((14 * 24 * 60 * 60) * 1000) }
      var date = new Date()
      date.setTime(date.getTime() + expires)
      var set_cookie = [
        this._key(key), "=", value, 
        "; expires=", date.toGMTString(), 
        "; path=", '/'
      ].join('')
      document.cookie = set_cookie
    }
  }  
}