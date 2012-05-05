// Generated by CoffeeScript 1.3.1
var soma, wings;

soma = require('soma');

wings = require('wings');

soma.chunks({
  About: {
    meta: function() {
      return new soma.chunks.Base({
        content: this
      });
    },
    prepare: function() {
      return this.template = this.loadTemplate('/build/client/templates/about.html');
    },
    build: function() {
      this.setTitle("About - The Puzzle School");
      return this.html = wings.renderTemplate(this.template);
    }
  }
});

soma.views({
  About: {
    selector: '#content .about',
    create: function() {}
  }
});

soma.routes({
  '/about': function() {
    return new soma.chunks.About;
  }
});
