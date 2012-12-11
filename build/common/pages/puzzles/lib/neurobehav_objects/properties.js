// Generated by CoffeeScript 1.3.3
var properties;

properties = typeof exports !== "undefined" && exports !== null ? exports : provide('./properties', {});

properties.Properties = (function() {

  function Properties(_arg) {
    this.el = _arg.el, this.initDescription = _arg.initDescription;
    this.init();
  }

  Properties.prototype.init = function() {
    this.nothingSelected = this.el.find('.nothing_selected');
    this.objectProperties = this.el.find('.object_properties');
    return this.objectType = this.el.find('.object_type');
  };

  Properties.prototype.show = function(element, name, properties) {
    var previouslySelectedElement, propertyId, _fn,
      _this = this;
    this.name = name;
    this.properties = properties;
    previouslySelectedElement = this.element;
    this.element = element;
    this.nothingSelected.hide();
    this.objectProperties.show();
    this.objectProperties.html(this.formatDescription(this.properties.description));
    _fn = function(propertyId) {
      var input, property;
      property = _this.properties[propertyId];
      _this.objectProperties.append("<p>" + property.name + ": \n    <span class='" + propertyId + "'>" + (_this["" + property.type + "Element"](property)) + "</span> (" + property.unitName + ")\n</p>");
      input = _this.objectProperties.find("." + propertyId).find('input, select');
      return input.bind('change keypress', function() {
        var value;
        value = parseFloat(input.val());
        property.value = value;
        if (property.set) {
          return property.set(value);
        }
      });
    };
    for (propertyId in this.properties) {
      if (propertyId === 'description') {
        continue;
      }
      _fn(propertyId);
    }
    this.objectType.html(this.name);
    this.initDescription();
    return previouslySelectedElement;
  };

  Properties.prototype.formatDescription = function(description) {
    var brief;
    description = description.replace(/^\s+/, '');
    if (!(description != null ? description.length : void 0)) {
      return '';
    }
    if (description.length < 22) {
      return description;
    }
    brief = description.slice(0, 40).replace(/<[^>]+\>/, '');
    return " \n" + brief + "... (<a class='read_more_description'>more</a>)\n<div class='more_description'><h4>" + this.name + "</h4>" + description + "</div>";
  };

  Properties.prototype.hide = function(element) {
    if (element && element !== this.element) {
      return;
    }
    this.objectProperties.hide();
    return this.nothingSelected.show();
  };

  Properties.prototype.set = function(id, value) {
    value = parseFloat(value);
    this.objectProperties.find("." + id).find('input, select').val(value + '');
    if (this.properties) {
      return this.properties[id].value = value;
    }
  };

  Properties.prototype.selectElement = function(property) {
    var options, selected, value, _i, _ref, _ref1, _ref2;
    options = [];
    for (value = _i = _ref = property.min || 0, _ref1 = property.max, _ref2 = property.unit; _ref <= _ref1 ? _i <= _ref1 : _i >= _ref1; value = _i += _ref2) {
      selected = ("" + value) === ("" + property.value);
      options.push("<option value=" + value + " " + (selected ? 'selected=selected' : '') + ">" + value + "</option>");
    }
    return "<select>" + (options.join('')) + "</select>";
  };

  return Properties;

})();
