// Generated by CoffeeScript 1.3.3
var fn, name, xyflyer, _ref;

xyflyer = typeof exports !== "undefined" && exports !== null ? exports : provide('./lib/xyflyer', {});

_ref = require('./xyflyer_objects/index');
for (name in _ref) {
  fn = _ref[name];
  xyflyer[name] = fn;
}

xyflyer.ChunkHelper = (function() {

  function ChunkHelper() {}

  return ChunkHelper;

})();

xyflyer.ViewHelper = (function() {

  function ViewHelper(_arg) {
    var boardElement, grid, objects;
    this.el = _arg.el, this.equationArea = _arg.equationArea, boardElement = _arg.boardElement, objects = _arg.objects, grid = _arg.grid;
    this.board = new xyflyer.Board({
      boardElement: boardElement,
      grid: grid,
      objects: objects
    });
    this.plane = new xyflyer.Plane({
      board: this.board
    });
    this.parser = require('./parser');
    this.initEquations();
  }

  ViewHelper.prototype.$ = function(selector) {
    return $(selector, this.el);
  };

  ViewHelper.prototype.plot = function(id, data) {
    var area, formula, _ref1;
    _ref1 = this.parser.parse(data), formula = _ref1[0], area = _ref1[1];
    return this.board.plot(id, formula, area);
  };

  ViewHelper.prototype.addRing = function(x, y) {
    return new xyflyer.Ring({
      board: this.board,
      x: x,
      y: y
    });
  };

  ViewHelper.prototype.initEquations = function() {
    var _this = this;
    return this.equations = new xyflyer.Equations({
      area: this.equationArea,
      submit: function() {
        return _this.plane.launch(true);
      }
    });
  };

  ViewHelper.prototype.addEquationComponent = function(equationFragment, equationAreas) {
    return this.equations.addEquationComponent(equationFragment, equationAreas);
  };

  return ViewHelper;

})();
