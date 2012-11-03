// Generated by CoffeeScript 1.3.3
var spaceFractionsEditor;

spaceFractionsEditor = typeof exports !== "undefined" && exports !== null ? exports : provide('./lib/space_fractions_editor', {});

spaceFractionsEditor.EditorHelper = (function() {

  function EditorHelper(_arg) {
    var encodeMethod;
    this.el = _arg.el, this.viewHelper = _arg.viewHelper, encodeMethod = _arg.encodeMethod;
    this.encode = encodeMethod;
    this.initElementSelector();
    this.initSquares();
    this.initLevelDescription();
  }

  EditorHelper.prototype.$ = function(selector) {
    return $(selector, this.el);
  };

  EditorHelper.prototype.initElementSelector = function() {
    this.elementSelector = $(document.createElement('DIV'));
    this.elementSelector.addClass('element_selector');
    this.initObjectSelector();
    this.initFractionSelector();
    return this.el.append(this.elementSelector);
  };

  EditorHelper.prototype.initLevelDescription = function() {
    var loadLevelDescription, verifiedMessages,
      _this = this;
    verifiedMessages = $(document.createElement('DIV'));
    verifiedMessages.addClass('verification_messages');
    verifiedMessages.html('<div class=\'verification_message verified\'>\n    <h3>Verified</h3>\n    All ships are full.\n</div>\n<div class=\'verification_message unverified\'>\n    <h3>Unverified</h3>\n    Not all ships are full.\n</div>\n<a class=\'play_level\' target=\'_blank\'>Play Level</a>\n<p>Share: <input type=\'text\' class=\'share_link\' /></p>');
    this.el.append(verifiedMessages);
    this.playLevel = verifiedMessages.find('.play_level');
    this.shareLink = verifiedMessages.find('.share_link');
    this.shareLink.bind('focus', function() {
      return _this.shareLink[0].select();
    });
    this.levelDescription = $(document.createElement('textarea'));
    this.levelDescription.addClass('level_description');
    this.el.append(this.levelDescription);
    loadLevelDescription = $(document.createElement('button'));
    loadLevelDescription.html('Load To Edit');
    loadLevelDescription.bind('click', function() {
      return _this.load();
    });
    return this.el.append(loadLevelDescription);
  };

  EditorHelper.prototype.initObjectSelector = function() {
    var clear, close, objectSelector, objectType, sortedObjectTypes, _fn, _i, _len,
      _this = this;
    objectSelector = $(document.createElement('DIV'));
    objectSelector.addClass('selector');
    objectSelector.addClass('object_selector');
    objectSelector.html('<h3>Select what to put in this square:</h3>');
    close = $(document.createElement('DIV'));
    close.html('<a>Close</a>');
    close.addClass('object');
    close.bind('click', function() {
      return _this.closeElementSelector();
    });
    objectSelector.append(close);
    clear = $(document.createElement('DIV'));
    clear.html('<a>Clear</a>');
    clear.addClass('object');
    clear.bind('click', function() {
      return _this.removeObject();
    });
    objectSelector.append(clear);
    sortedObjectTypes = Object.keys(this.viewHelper.objects).sort(function(a, b) {
      return _this.viewHelper.objects[a].index - _this.viewHelper.objects[b].index;
    });
    _fn = function(objectType) {
      var object, objectContainer, objectImage, src;
      object = _this.viewHelper.objects[objectType];
      objectContainer = $(document.createElement('DIV'));
      objectContainer.addClass('object');
      objectContainer.addClass(object.movable ? 'movable' : 'static');
      objectContainer.data('objectType', objectType);
      objectContainer.bind('click', function() {
        return _this.addObject(objectType);
      });
      objectImage = $(document.createElement('IMG'));
      src = _this.viewHelper.baseFolder + object.image;
      src += object.states ? '_full.png' : '.png';
      objectImage.attr('src', src);
      objectContainer.append(objectImage);
      return objectSelector.append(objectContainer);
    };
    for (_i = 0, _len = sortedObjectTypes.length; _i < _len; _i++) {
      objectType = sortedObjectTypes[_i];
      _fn(objectType);
    }
    return this.elementSelector.append(objectSelector);
  };

  EditorHelper.prototype.initFractionSelector = function() {
    var setFraction,
      _this = this;
    this.fractionSelector = $(document.createElement('DIV'));
    this.fractionSelector.html("<h2>Select A Fraction</h2>\n<p>What fraction of laser should this object use?</p>\n<p>\n    <input name='numerator' class='numerator' type='text' value='1'/>\n    <span class='solidus'>/</span>\n    <input name='denominator' class='denominator' type='text' value='1'/>\n</p>\n<p class='fraction'>Fraction: 1/1 or " + (Math.round(1000 * (1 / 1)) / 1000) + "</p>\n<button class='set_fraction'>Set</button>\n<br/>\n<p><a class='select_new_object'>< Select a different object</a></p>");
    setFraction = this.fractionSelector.find('.set_fraction');
    setFraction.bind('click', function() {
      _this[setFraction.data('callback')](_this.fractionSelector.find('.numerator').val(), _this.fractionSelector.find('.denominator').val());
      return _this.closeElementSelector();
    });
    this.fractionSelector.find('.numerator, .denominator').bind('keyup', function() {
      _this.displayFractionValue();
      return _this[setFraction.data('callback')](_this.fractionSelector.find('.numerator').val(), _this.fractionSelector.find('.denominator').val());
    });
    this.fractionSelector.find('.select_new_object').bind('click', function() {
      return _this.showSelector('object');
    });
    this.fractionSelector.addClass('selector');
    this.fractionSelector.addClass('fraction_selector');
    this.fractionSelector.hide();
    return this.elementSelector.append(this.fractionSelector);
  };

  EditorHelper.prototype.setFractionValue = function(numeratorVal, denominatorVal) {
    if (numeratorVal == null) {
      numeratorVal = 1;
    }
    if (denominatorVal == null) {
      denominatorVal = 1;
    }
    this.fractionSelector.find('.numerator').val(numeratorVal.toString());
    this.fractionSelector.find('.denominator').val(denominatorVal.toString());
    return this.displayFractionValue();
  };

  EditorHelper.prototype.displayFractionValue = function() {
    var denominatorVal, numeratorVal;
    numeratorVal = this.fractionSelector.find('.numerator').val();
    denominatorVal = this.fractionSelector.find('.denominator').val();
    return this.fractionSelector.find('.fraction').html("Fraction: " + numeratorVal + "/" + denominatorVal + " or " + (Math.round(1000 * (numeratorVal / denominatorVal)) / 1000));
  };

  EditorHelper.prototype.selectSquare = function(square) {
    this.$('.board .selected').removeClass('selected');
    square = $(square);
    square.addClass('selected');
    return this.showElementSelector(square);
  };

  EditorHelper.prototype.initSquares = function() {
    var _this = this;
    return this.$('.square').bind('click', function(e) {
      return _this.selectSquare(e.currentTarget);
    });
  };

  EditorHelper.prototype.showElementSelector = function(square) {
    var offset;
    square = $(square);
    offset = square.offset();
    if (square.parent().hasClass('options')) {
      this.elementSelector.find('.static').hide();
    } else {
      this.elementSelector.find('.object').show();
    }
    this.elementSelector.css({
      opacity: 0,
      top: offset.top + offset.height + 6,
      left: offset.left + (offset.width / 2) - (this.elementSelector.offset().width / 2)
    });
    this.showObjectSelector();
    return this.elementSelector.animate({
      opacity: 1,
      duration: 250
    });
  };

  EditorHelper.prototype.closeElementSelector = function() {
    var _this = this;
    this.$('.square.selected').removeClass('selected');
    return this.elementSelector.animate({
      opacity: 0,
      duration: 250,
      complete: function() {
        return _this.elementSelector.css({
          top: -1000,
          left: -1000
        });
      }
    });
  };

  EditorHelper.prototype.addObject = function(objectType) {
    var object, selectedSquare;
    selectedSquare = this.$('.square.selected');
    this.viewHelper.addObjectToSquare(objectType, selectedSquare);
    selectedSquare.unbind('mousedown');
    this.save();
    object = this.viewHelper.objects[objectType];
    return this.showObjectSelector(true);
  };

  EditorHelper.prototype.removeObject = function() {
    var selectedSquare;
    selectedSquare = this.$('.square.selected');
    this.viewHelper.removeObjectFromSquare(selectedSquare);
    this.levelDescription.val('');
    this.closeElementSelector();
    return this.save();
  };

  EditorHelper.prototype.showObjectSelector = function(close) {
    var object, selectedSquare;
    if (close == null) {
      close = false;
    }
    selectedSquare = this.$('.square.selected');
    if (!selectedSquare.hasClass('occupied')) {
      this.showSelector('object');
      return;
    }
    object = this.viewHelper.objects[selectedSquare.data('objectType')];
    if ((object.distribute && !object.accept) || (object.accept && !object.distribute)) {
      if (this.viewHelper.objects[selectedSquare.data('objectType')].states) {
        this.setFractionValue(selectedSquare.data('fullNumerator') || 1, selectedSquare.data('fullDenominator') || 1);
      } else {
        this.setFractionValue(selectedSquare.data('numerator') || 1, selectedSquare.data('denominator') || 1);
      }
      this.fractionSelector.find('.set_fraction').data('callback', 'setObjectFraction');
      return this.showSelector('fraction');
    } else {
      if (close) {
        return this.closeElementSelector();
      } else {
        return this.showSelector('object');
      }
    }
  };

  EditorHelper.prototype.setObjectFraction = function(numerator, denominator) {
    var selectedSquare;
    selectedSquare = this.viewHelper.board.find('.selected');
    if (this.viewHelper.objects[selectedSquare.data('objectType')].states) {
      selectedSquare.data('fullNumerator', numerator);
      selectedSquare.data('fullDenominator', denominator);
      this.viewHelper.setObjectImage(selectedSquare);
    } else {
      selectedSquare.data('numerator', numerator);
      selectedSquare.data('denominator', denominator);
    }
    selectedSquare.attr('title', "Fraction: " + numerator + "/" + denominator);
    this.viewHelper.showFraction(selectedSquare);
    this.viewHelper.fireLaser(selectedSquare);
    return this.save();
  };

  EditorHelper.prototype.showSelector = function(selectorPage) {
    var selector, selectors,
      _this = this;
    selectors = this.elementSelector.find('.selector');
    selector = this.elementSelector.find("." + selectorPage + "_selector");
    if (parseInt(this.elementSelector.css('opacity'))) {
      return selectors.animate({
        opacity: 0,
        duration: 250,
        complete: function() {
          selectors.hide();
          selector.css({
            opacity: 0,
            display: 'block'
          });
          return selector.animate({
            opacity: 1,
            duration: 250
          });
        }
      });
    } else {
      selectors.hide();
      return selector.css({
        opacity: 1,
        display: 'block'
      });
    }
  };

  EditorHelper.prototype.save = function() {
    var href, json, levelDescription, levelVerified, object, objectMeta, square, _i, _j, _len, _len1, _ref, _ref1;
    this.levelDescription.val('');
    levelDescription = {
      objects: []
    };
    levelVerified = true;
    _ref = this.viewHelper.board.find('.square.occupied');
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      square = _ref[_i];
      square = $(square);
      object = {
        type: square.data('objectType'),
        index: square.data('index')
      };
      objectMeta = this.viewHelper.objects[square.data('objectType')];
      if (objectMeta.states) {
        object.fullNumerator = square.data('fullNumerator');
        object.fullDenominator = square.data('fullDenominator');
        if (square.html().indexOf('full') === -1) {
          levelVerified = false;
        }
      } else if (objectMeta.distribute && !objectMeta.accept) {
        object.numerator = square.data('numerator');
        object.denominator = square.data('denominator');
      }
      levelDescription.objects.push(object);
    }
    _ref1 = this.viewHelper.options.find('.square.occupied');
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      square = _ref1[_j];
      square = $(square);
      object = {
        type: square.data('objectType')
      };
      levelDescription.objects.push(object);
    }
    levelDescription.verified = levelVerified;
    this.$('.verification_message').hide();
    if (levelVerified) {
      this.$('.verified').show();
    } else {
      this.$('.unverified').show();
    }
    json = JSON.stringify(levelDescription);
    this.levelDescription.val(json);
    window.location.hash = encodeURIComponent(this.encode(json));
    href = window.location.href.toString().replace(/editor/, 'custom');
    this.playLevel.attr('href', href);
    return this.shareLink.val(href);
  };

  EditorHelper.prototype.load = function() {
    var denominator, json, numerator, object, _i, _len, _ref;
    json = JSON.parse(this.levelDescription.val());
    this.levelDescription.val('');
    this.clear();
    _ref = json.objects;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      object = _ref[_i];
      if (object.index) {
        this.selectSquare(this.viewHelper.board.find(".square.index" + object.index));
        this.addObject(object.type);
        if ((numerator = object.fullNumerator || object.numerator) && (denominator = object.fullDenominator || object.denominator)) {
          this.setObjectFraction(numerator, denominator);
        }
      } else {
        this.selectSquare(this.viewHelper.options.find(".square:not(.occupied)")[0]);
        this.addObject(object.type);
      }
    }
    return this.closeElementSelector();
  };

  EditorHelper.prototype.clear = function() {
    var square, _i, _len, _ref, _results;
    _ref = this.viewHelper.board.find('.square.occupied');
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      square = _ref[_i];
      this.selectSquare(square);
      _results.push(this.removeObject());
    }
    return _results;
  };

  return EditorHelper;

})();
