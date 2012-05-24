// Generated by CoffeeScript 1.3.1
var soma, wings;

soma = require('soma');

wings = require('wings');

soma.chunks({
  Home: {
    meta: function() {
      return new soma.chunks.Base({
        content: this
      });
    },
    prepare: function() {
      return this.template = this.loadTemplate('/build/common/templates/home.html');
    },
    build: function() {
      this.setTitle('The Puzzle School');
      return this.html = wings.renderTemplate(this.template);
    }
  }
});

soma.routes({
  '': function() {
    return new soma.chunks.Home;
  },
  '/': function() {
    return new soma.chunks.Home;
  }
});