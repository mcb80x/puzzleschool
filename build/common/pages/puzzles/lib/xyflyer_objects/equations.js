// Generated by CoffeeScript 1.3.3
var EquationComponent, equations;

equations = typeof exports !== "undefined" && exports !== null ? exports : provide('./equations', {});

EquationComponent = require('./equation_component').EquationComponent;

equations.Equations = (function() {

  function Equations(_arg) {
    var submit,
      _this = this;
    this.el = _arg.el, submit = _arg.submit;
    this.possibleFragments = this.$('.possible_fragments');
    this.$('.launch').bind('click', function() {
      return submit();
    });
  }

  Equations.prototype.$ = function(selector) {
    return $(selector, this.el);
  };

  Equations.prototype.addEquationComponent = function(equationFragment, equationAreas) {
    var equationComponent;
    equationComponent = new EquationComponent({
      equationFragment: equationFragment,
      equationAreas: equationAreas
    });
    return this.possibleFragments.append(equationComponent.asHtml());
  };

  return Equations;

})();