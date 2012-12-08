// Generated by CoffeeScript 1.3.3
var soma, wings;

soma = require('soma');

wings = require('wings');

soma.chunks({
  Neurobehav: {
    meta: function() {
      return new soma.chunks.Base({
        content: this
      });
    },
    prepare: function(_arg) {
      this.classId = _arg.classId, this.levelId = _arg.levelId;
      this.template = this.loadTemplate("/build/common/templates/puzzles/neurobehav.html");
      this.loadScript('/build/common/pages/puzzles/lib/neurobehav_objects/game.js');
      this.loadScript('/build/common/pages/puzzles/lib/neurobehav_objects/object.js');
      this.loadScript('/build/common/pages/puzzles/lib/neurobehav_objects/neuron.js');
      this.loadScript('/build/common/pages/puzzles/lib/neurobehav_objects/stimulus.js');
      this.loadScript('/build/common/pages/puzzles/lib/neurobehav_objects/oscilloscope.js');
      this.loadScript('/build/common/pages/puzzles/lib/neurobehav_objects/index.js');
      this.loadScript('/build/common/pages/puzzles/lib/neurobehav.js');
      this.loadScript('/assets/third_party/raphael-min.js');
      if (this.levelId === 'editor') {
        this.loadScript('/build/common/pages/puzzles/lib/neurobehav.js');
      }
      return this.loadStylesheet('/build/client/css/puzzles/neurobehav.css');
    },
    build: function() {
      this.setTitle("The Neurobiology of Behavior - The Puzzle School");
      return this.html = wings.renderTemplate(this.template, {
        editor: false
      });
    }
  }
});

soma.views({
  Neurobehav: {
    selector: '#content .neurobehav',
    create: function() {
      var neurobehav;
      neurobehav = require('./lib/neurobehav');
      return this.game = new neurobehav.Game({
        el: $(this.selector)
      });
    }
  }
});

soma.routes({
  '/puzzles/neurobehav/:classId/:levelId': function(_arg) {
    var classId, levelId;
    classId = _arg.classId, levelId = _arg.levelId;
    return new soma.chunks.Neurobehav({
      classId: classId,
      levelId: levelId
    });
  },
  '/puzzles/neurobehav/:levelId': function(_arg) {
    var levelId;
    levelId = _arg.levelId;
    return new soma.chunks.Neurobehav({
      levelId: levelId
    });
  },
  '/puzzles/neurobehav': function() {
    return new soma.chunks.Neurobehav;
  }
});
