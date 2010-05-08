exports.GoHelpers = {
  flash: function(message) {
    $('#flash').text(message).show().delay(2000).fadeOut('slow');
  }
};