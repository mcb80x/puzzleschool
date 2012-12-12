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
      var object, _i, _len, _ref;
      this.classId = _arg.classId, this.levelId = _arg.levelId;
      this.template = this.loadTemplate("/build/common/templates/puzzles/xyflyer.html");
      this.loadScript('/build/common/pages/puzzles/lib/xyflyer.js');
      this.loadScript('/build/common/pages/puzzles/lib/tdop.js');
      this.loadScript('/assets/third_party/equation_explorer/tokens.js');
      this.loadScript('/assets/third_party/raphael-min.js');
      this.objects = [];
      _ref = ['island', 'plane'];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        object = _ref[_i];
        this.objects.push({
          name: object,
          image: this.loadImage("/assets/images/puzzles/xyflyer/" + object + ".png")
        });
      }
      if (this.levelId === 'editor') {
        this.loadScript('/build/common/pages/puzzles/lib/xyflyer_editor.js');
      }
      return this.loadStylesheet('/build/client/css/puzzles/xyflyer.css');
    },
    build: function() {
      this.setTitle("XYFlyer - The Puzzle School");
      return this.html = wings.renderTemplate(this.template, {
        objects: this.objects
      });
    }
  }
});

soma.views({
  Xyflyer: {
    selector: '#content .xyflyer',
    create: function() {
      var xyflyer,
        _this = this;
      xyflyer = require('./lib/xyflyer');
      this.viewHelper = new xyflyer.ViewHelper({
        el: $(this.selector),
        boardElement: this.$('.board'),
        objects: this.$('.objects'),
        grid: {
          xMin: -10,
          xMax: 10,
          yMin: -10,
          yMax: 10
        }
      });
      this.tdop = require('./lib/tdop');
      this.initEquations();
      return this.$('.launch').bind('click', function() {
        return _this.viewHelper.launchPlane();
      });
    },
    initEquations: function() {
      var _this = this;
      return this.$('.equation').bind('keyup', function(e) {
        var area, formula, input, parts, val;
        input = $(e.currentTarget);
        try {
          val = input.val();
          parts = input.val().replace(/\s/g, '').split(/[{}]/);
          formula = _this.tdop.compileToJs(parts[0]);
          area = _this.calculateArea(parts[1]);
        } catch (err) {

        }
        return _this.viewHelper.plot(input.attr('id'), formula, area);
      });
    },
    calculateArea: function(areaString) {
      var parts;
      parts = areaString.replace(/[^=0-9.<>xy-]/g, '').split(/x/);
      return function(x) {
        if (!eval(parts[0] + 'x')) {
          return false;
        }
        if (!eval('x' + parts[1])) {
          return false;
        }
        return true;
      };
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
