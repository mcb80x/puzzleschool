// Generated by CoffeeScript 1.3.3
var soma, wings;

soma = require('soma');

wings = require('wings');

soma.chunks({
  Xyflyer: {
    meta: function() {
      return new soma.chunks.Base({
        content: this
      });
    },
    prepare: function(_arg) {
      this.classId = _arg.classId, this.levelId = _arg.levelId;
      this.template = this.loadTemplate("/build/common/templates/puzzles/xyflyer.html");
      this.loadScript('/build/common/pages/puzzles/lib/xyflyer.js');
      this.loadScript('/build/common/pages/puzzles/lib/tdop.js');
      this.loadScript('/assets/third_party/equation_explorer/tokens.js');
      if (this.levelId === 'editor') {
        this.loadScript('/build/common/pages/puzzles/lib/xyflyer_editor.js');
      }
      return this.loadStylesheet('/build/client/css/puzzles/xyflyer.css');
    },
    build: function() {
      this.setTitle("XYFlyer - The Puzzle School");
      return this.html = wings.renderTemplate(this.template);
    }
  }
});

soma.views({
  Xyflyer: {
    selector: '#content .xyflyer',
    create: function() {
      var xyflyer;
      xyflyer = require('./lib/xyflyer');
      this.viewHelper = new xyflyer.ViewHelper({
        el: $(this.selector),
        backgroundCanvas: this.$('.board .background_canvas'),
        grid: {
          xMin: -10,
          xMax: 10,
          yMin: -10,
          yMax: 10
        }
      });
      this.tdop = require('./lib/tdop');
      return this.initEquations();
    },
    initEquations: function() {
      var _this = this;
      return this.$('.equation').bind('keyup', function(e) {
        var formula, input;
        input = e.currentTarget;
        try {
          formula = _this.tdop.compileToJs($(input).val());
        } catch (err) {

        }
        return _this.viewHelper.plot(formula, input.id);
      });
    }
  }
});

soma.routes({
  '/puzzles/xyflyer/:classId/:levelId': function(_arg) {
    var classId, levelId;
    classId = _arg.classId, levelId = _arg.levelId;
    return new soma.chunks.Xyflyer({
      classId: classId,
      levelId: levelId
    });
  },
  '/puzzles/xyflyer/:levelId': function(_arg) {
    var levelId;
    levelId = _arg.levelId;
    return new soma.chunks.Xyflyer({
      levelId: levelId
    });
  },
  '/puzzles/xyflyer': function() {
    return new soma.chunks.Xyflyer;
  }
});