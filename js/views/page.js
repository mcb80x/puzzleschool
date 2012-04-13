var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
(function($) {
  var views;
  views = require('views');
  return views.Page = (function() {
    __extends(Page, views.BaseView);
    function Page(options) {
      if (options == null) {
        options = {};
      }
      Page.__super__.constructor.call(this, options);
      $('.nav-item.selected').removeClass('selected');
      $(".nav-item." + this.name).addClass('selected');
      if (this.userSignedIn()) {
        $('.user-signed-in').show();
      } else {
        $('.user-signed-in').hide();
      }
    }
    Page.prototype.renderError = function() {
      this.el.html('<h2 class="message">An error has occurred.</h2>');
      return Page.__super__.renderError.apply(this, arguments);
    };
    return Page;
  })();
})(ender);