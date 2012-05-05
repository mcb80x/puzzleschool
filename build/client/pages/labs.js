// Generated by CoffeeScript 1.3.1
var soma, wings;

soma = require('soma');

wings = require('wings');

soma.chunks({
  Labs: {
    meta: function() {
      return new soma.chunks.Base({
        content: this
      });
    },
    prepare: function() {
      return this.template = this.loadTemplate('/build/client/templates/labs.html');
    },
    build: function() {
      this.setTitle("Labs - The Puzzle School");
      return this.html = wings.renderTemplate(this.template);
    }
  }
});

soma.views({
  Labs: {
    selector: '#content .labs',
    create: function() {}
  }
});

soma.routes({
  '/labs': function() {
    return new soma.chunks.Labs;
  }
});
