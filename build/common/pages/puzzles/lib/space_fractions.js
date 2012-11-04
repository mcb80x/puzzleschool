// Generated by CoffeeScript 1.3.3
var LASER_HEIGHT, OBJECTS, direction, direction2, directions, index, index2, shuffle, spaceFractions, _i, _j, _len, _len1,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

shuffle = function(array) {
  var current, tmp, top;
  top = array.length;
  if (!top) {
    return array;
  }
  while (top--) {
    current = Math.floor(Math.random() * (top + 1));
    tmp = array[current];
    array[current] = array[top];
    array[top] = tmp;
  }
  return array;
};

spaceFractions = typeof exports !== "undefined" && exports !== null ? exports : provide('./lib/space_fractions', {});

LASER_HEIGHT = 20;

OBJECTS = {
  rock1: {
    image: 'rock1',
    index: -1
  },
  rock2: {
    image: 'rock2',
    index: -2
  }
};

directions = ['up', 'down', 'left', 'right'];

for (index = _i = 0, _len = directions.length; _i < _len; index = ++_i) {
  direction = directions[index];
  OBJECTS["ship_" + direction] = {
    index: index,
    image: "ship_" + direction,
    accept: true,
    acceptDirections: [direction],
    states: true,
    showFraction: true
  };
  OBJECTS["laser_" + direction] = {
    index: 10 + index,
    image: "laser_" + direction,
    distribute: true,
    distributeDirections: [direction],
    accept: false,
    showFraction: true
  };
  for (index2 = _j = 0, _len1 = directions.length; _j < _len1; index2 = ++_j) {
    direction2 = directions[index2];
    if ((index < 2 && index2 < 2) || (index > 1 && index2 > 1)) {
      continue;
    }
    OBJECTS["turn_" + direction + "_" + direction2] = {
      index: 100 + index2,
      image: "turn_" + direction + "_" + direction2,
      distribute: true,
      distributeDirections: [direction2],
      accept: true,
      acceptDirections: [direction],
      movable: true
    };
    OBJECTS["two_split_" + direction + "_" + direction2] = {
      index: 1000 + index2,
      image: "two_split_" + direction + "_" + direction2,
      distribute: true,
      distributeDirections: [direction, direction2],
      accept: true,
      acceptDirections: [direction],
      denominatorMultiplier: 2,
      movable: true
    };
  }
}

spaceFractions.ChunkHelper = (function() {

  ChunkHelper.prototype.objects = OBJECTS;

  function ChunkHelper() {}

  return ChunkHelper;

})();

spaceFractions.ViewHelper = (function() {

  ViewHelper.prototype.baseFolder = '/assets/images/puzzles/space_fractions/';

  ViewHelper.prototype.objects = OBJECTS;

  function ViewHelper(_arg) {
    var _this = this;
    this.el = _arg.el, this.rows = _arg.rows, this.columns = _arg.columns;
    this.initBoard();
    this.initOptions();
    this.initHint();
    window.onresize = function() {
      var square, _k, _len2, _ref, _results;
      _ref = _this.board.find('.square.occupied');
      _results = [];
      for (_k = 0, _len2 = _ref.length; _k < _len2; _k++) {
        square = _ref[_k];
        _results.push(_this.fireLaser(square));
      }
      return _results;
    };
  }

  ViewHelper.prototype.$ = function(selector) {
    return $(selector, this.el);
  };

  ViewHelper.prototype.initBoard = function() {
    var column, row, square, _k, _ref, _results;
    this.board = this.$('.board');
    this.board.html('');
    _results = [];
    for (row = _k = 0, _ref = this.rows; 0 <= _ref ? _k < _ref : _k > _ref; row = 0 <= _ref ? ++_k : --_k) {
      _results.push((function() {
        var _l, _ref1, _results1;
        _results1 = [];
        for (column = _l = 0, _ref1 = this.columns; 0 <= _ref1 ? _l < _ref1 : _l > _ref1; column = 0 <= _ref1 ? ++_l : --_l) {
          index = (row * this.rows) + column;
          square = $(document.createElement('DIV'));
          square.addClass('square');
          square.data('index', index);
          square.addClass("index" + index);
          _results1.push(this.board.append(square));
        }
        return _results1;
      }).call(this));
    }
    return _results;
  };

  ViewHelper.prototype.initOptions = function() {
    var column, row, square, _k, _results;
    this.options = this.$('.options');
    this.options.html('');
    _results = [];
    for (row = _k = 0; _k < 7; row = ++_k) {
      _results.push((function() {
        var _l, _results1;
        _results1 = [];
        for (column = _l = 0; _l < 4; column = ++_l) {
          index = (row * 3) + column;
          square = $(document.createElement('DIV'));
          square.addClass('square');
          square.data('index', index);
          square.addClass("index" + index);
          _results1.push(this.options.append(square));
        }
        return _results1;
      }).call(this));
    }
    return _results;
  };

  ViewHelper.prototype.initHint = function() {
    var _this = this;
    return this.$('.hint').bind('click', function() {
      var boardOption, boardOptions, dragMessage, o, object, option, square, _k, _l, _len2, _len3, _ref;
      _ref = _this.solution.objects;
      for (_k = 0, _len2 = _ref.length; _k < _len2; _k++) {
        object = _ref[_k];
        square = _this.board.find(".square.index" + object.index);
        if (square.length && square.data('objectType') !== object.type) {
          option = $(_this.options.find(".square." + object.type)[0]);
          if (!(option != null ? option.length : void 0)) {
            boardOptions = _this.board.find(".square." + object.type);
            for (_l = 0, _len3 = boardOptions.length; _l < _len3; _l++) {
              boardOption = boardOptions[_l];
              if (((function() {
                var _len4, _m, _ref1, _results;
                _ref1 = this.solution.objects;
                _results = [];
                for (_m = 0, _len4 = _ref1.length; _m < _len4; _m++) {
                  o = _ref1[_m];
                  if (o.index === $(boardOption).data('index')) {
                    _results.push(o.type);
                  }
                }
                return _results;
              }).call(_this))[0] !== object.type) {
                option = $(boardOption);
                break;
              }
            }
          }
          if (option != null ? option.length : void 0) {
            option.addClass('selected');
            dragMessage = _this.$('.hint_drag_message');
            dragMessage.css({
              left: option.offset().left + (option.width() / 2) - (dragMessage.width() / 2),
              top: option.offset().top + option.height()
            });
            dragMessage.animate({
              opacity: 1,
              duration: 250
            });
            option.one('mousedown', function() {
              var dropMessage, hideHint;
              dragMessage.css({
                opacity: 0
              });
              square.addClass('permanently_selected');
              dropMessage = _this.$('.hint_drop_message');
              dropMessage.css({
                left: square.offset().left + (square.width() / 2) - (dropMessage.width() / 2),
                top: square.offset().top + square.height()
              });
              dropMessage.animate({
                opacity: 1,
                duration: 250
              });
              hideHint = function() {
                if (!square.hasClass(object.type)) {
                  $.timeout(50, function() {
                    return hideHint();
                  });
                  return;
                }
                _this.$('.hint_message').animate({
                  opacity: 0,
                  duration: 250
                });
                return _this.$('.square.permanently_selected').removeClass('permanently_selected');
              };
              return hideHint();
            });
            return;
          }
        }
      }
    });
  };

  ViewHelper.prototype.setObjectImage = function(square) {
    var acceptedLaser, fraction, laserData, objectMeta, objectType, state, totalLaser;
    objectType = square.data('objectType');
    objectMeta = this.objects[objectType];
    if (!objectMeta) {
      return;
    }
    if (objectMeta.states) {
      laserData = JSON.parse(square.data('lasers') || '{}');
      acceptedLaser = laserData[objectMeta.acceptDirections[0]];
      totalLaser = acceptedLaser ? acceptedLaser.numerator / acceptedLaser.denominator : 0;
      fraction = parseInt(square.data('fullNumerator')) / parseInt(square.data('fullDenominator'));
      if (isNaN(fraction)) {
        fraction = 1;
      }
      if (totalLaser === 0) {
        state = 'empty';
      } else if (totalLaser < fraction) {
        state = 'under';
      } else if (totalLaser === fraction) {
        state = 'full';
      } else if (totalLaser > fraction) {
        state = 'over';
      }
      square.find('img').attr('src', "" + this.baseFolder + objectMeta.image + "_" + state + ".png");
    } else {
      square.find('img').attr('src', "" + this.baseFolder + objectMeta.image + ".png");
    }
    return square.find('img').bind("mousedown", function(e) {
      if (e.preventDefault) {
        e.preventDefault();
      }
      return false;
    });
  };

  ViewHelper.prototype.showFraction = function(squareOrLaser) {
    var beam, denominator, fraction, numerator,
      _this = this;
    if (!squareOrLaser.height()) {
      $.timeout(50, function() {
        return _this.showFraction(squareOrLaser);
      });
      return;
    }
    squareOrLaser.find('.fraction').remove();
    fraction = $(document.createElement('DIV'));
    numerator = squareOrLaser.data('fullNumerator') || squareOrLaser.data('numerator') || 1;
    denominator = squareOrLaser.data('fullDenominator') || squareOrLaser.data('denominator') || 1;
    fraction.html("" + numerator + "/" + denominator);
    fraction.addClass('fraction');
    if (squareOrLaser.hasClass('laser')) {
      beam = squareOrLaser.find('.beam');
      beam.append(fraction);
      return fraction.css({
        top: (beam.height() / 2) - (fraction.height() / 2),
        left: (beam.width() / 2) - (fraction.width() / 2)
      });
    } else {
      return squareOrLaser.append(fraction);
    }
  };

  ViewHelper.prototype.initMovableObject = function(square) {
    var moveObject, objectMeta, objectType,
      _this = this;
    objectType = square.data('objectType');
    objectMeta = this.objects[objectType];
    moveObject = function(e) {
      var body, endMove, move, movingObject;
      if (e.preventDefault != null) {
        e.preventDefault();
      }
      if (_this.movingObject) {
        return;
      }
      _this.movingObject = true;
      movingObject = square.find('img');
      _this.el.append(movingObject);
      movingObject.addClass('movable_object');
      movingObject.css({
        left: e.clientX - (square.width() / 2),
        top: e.clientY - (square.height() / 2)
      });
      _this.removeObjectFromSquare(square);
      body = $(document.body);
      move = function(e) {
        var boardSquare, left, offset, top, _k, _len2, _ref, _results;
        if (e.preventDefault) {
          e.preventDefault();
        }
        if (!movingObject) {
          return;
        }
        left = e.clientX - (square.width() / 2);
        top = e.clientY - (square.height() / 2);
        movingObject.css({
          left: left,
          top: top
        });
        _ref = _this.el.find('.square:not(.occupied)');
        _results = [];
        for (_k = 0, _len2 = _ref.length; _k < _len2; _k++) {
          boardSquare = _ref[_k];
          offset = $(boardSquare).offset();
          if (e.clientX >= offset.left && e.clientX < offset.left + offset.width && e.clientY >= offset.top && e.clientY < offset.top + offset.height) {
            _results.push($(boardSquare).addClass('selected'));
          } else {
            _results.push($(boardSquare).removeClass('selected'));
          }
        }
        return _results;
      };
      body.bind('mousemove', function(e) {
        return move(e);
      });
      body.bind('touchmove', function(e) {
        return move(e);
      });
      endMove = function(e) {
        var image, occupiedSquare, selectedSquare, _k, _len2, _ref;
        if (e.preventDefault) {
          e.preventDefault();
        }
        image = movingObject;
        movingObject = null;
        _this.el.find('.movable_object').remove();
        body.unbind('mousemove');
        body.unbind('mouseup');
        body.unbind('touchmove');
        body.unbind('touchend');
        selectedSquare = _this.$('.square.selected');
        if (!(selectedSquare != null ? selectedSquare.length : void 0)) {
          selectedSquare = square;
        }
        image.removeClass('movable_object');
        _this.addObjectToSquare(objectType, selectedSquare, image);
        selectedSquare.removeClass('selected');
        _ref = _this.$('.square.occupied');
        for (_k = 0, _len2 = _ref.length; _k < _len2; _k++) {
          occupiedSquare = _ref[_k];
          occupiedSquare = $(occupiedSquare);
          if (!occupiedSquare.find('img').length) {
            occupiedSquare.removeClass('occupied');
          }
        }
        return _this.movingObject = false;
      };
      body.bind('mouseup', function(e) {
        return endMove(e);
      });
      return body.bind('touchend', function(e) {
        return endMove(e);
      });
    };
    square.one('mousedown', function(e) {
      return moveObject(e);
    });
    return square.one('touchstart', function(e) {
      return moveObject(e);
    });
  };

  ViewHelper.prototype.addObjectToSquare = function(objectType, square, image) {
    var laserData, object, _k, _len2, _ref;
    square = $(square);
    square.html('');
    this.removeExistingLasers(square);
    square.addClass('occupied');
    square.addClass(objectType);
    square.data('objectType', objectType);
    object = this.objects[objectType];
    if (!image) {
      image = $(document.createElement('IMG'));
    }
    square.append(image);
    if (object.showFraction) {
      this.showFraction(square);
    }
    laserData = JSON.parse(square.data('lasers') || '{}');
    if (object.accept) {
      square.data('acceptDirections', JSON.stringify(object.acceptDirections));
      square.data('numeratorMultiplier', object.numeratorMultiplier || 1);
      square.data('denominatorMultiplier', object.denominatorMultiplier || 1);
      _ref = object.acceptDirections;
      for (_k = 0, _len2 = _ref.length; _k < _len2; _k++) {
        direction = _ref[_k];
        if (laserData[direction]) {
          square.data('numerator', laserData[direction].numerator);
          square.data('denominator', laserData[direction].denominator);
        }
      }
    }
    for (direction in laserData) {
      this.fireLaser(this.board.find(".square.index" + laserData[direction].index));
    }
    if (object.distribute) {
      square.data('distributeDirections', JSON.stringify(object.distributeDirections));
      this.fireLaser(square);
    }
    if (object.movable) {
      this.initMovableObject(square);
    }
    return this.setObjectImage(square);
  };

  ViewHelper.prototype.removeObjectFromSquare = function(square) {
    var attr, laserData, _results;
    square = $(square);
    if (!square.data('objectType')) {
      return;
    }
    this.removeExistingLasers(square);
    square.html('');
    square.removeClass('occupied');
    square.removeClass(square.data('objectType'));
    for (attr in square.data()) {
      if (attr !== 'index' && attr !== 'nodeUid' && attr !== 'lasers') {
        square.data(attr, null);
      }
    }
    laserData = JSON.parse(square.data('lasers') || '{}');
    _results = [];
    for (direction in laserData) {
      _results.push(this.fireLaser(this.$(".index" + laserData[direction].index)));
    }
    return _results;
  };

  ViewHelper.prototype.removeExistingLasers = function(square) {
    var existingLasers, laserData, laserSquare, squareIndex, _k, _len2, _ref, _results;
    square = $(square);
    squareIndex = square.data('index');
    if ((existingLasers = this.board.find(".laser.laser" + squareIndex)).length) {
      existingLasers.remove();
      _ref = this.board.find(".square.laser" + squareIndex);
      _results = [];
      for (_k = 0, _len2 = _ref.length; _k < _len2; _k++) {
        laserSquare = _ref[_k];
        laserSquare = $(laserSquare);
        laserSquare.removeClass("laser" + squareIndex);
        laserData = JSON.parse(laserSquare.data('lasers'));
        delete laserData[laserSquare.data("laser" + squareIndex)];
        laserSquare.data('lasers', JSON.stringify(laserData));
        laserSquare.data("laser" + squareIndex, null);
        if (laserSquare.hasClass('occupied')) {
          this.setObjectImage(laserSquare);
          _results.push(this.removeExistingLasers(laserSquare));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    }
  };

  ViewHelper.prototype.checkLaserPath = function(checkSquare, squareIndex, direction, numerator, denominator) {
    var acceptDirections, laserData, occupied;
    occupied = checkSquare.hasClass('occupied');
    acceptDirections = JSON.parse(checkSquare.data('acceptDirections') || null);
    if (occupied && !acceptDirections) {
      return false;
    }
    laserData = JSON.parse(checkSquare.data('lasers') || '{}');
    laserData[direction] = {
      index: squareIndex,
      numerator: numerator,
      denominator: denominator
    };
    checkSquare.data('lasers', JSON.stringify(laserData));
    checkSquare.data("laser" + squareIndex, direction);
    checkSquare.addClass("laser" + squareIndex);
    if (__indexOf.call(acceptDirections || [], direction) >= 0) {
      checkSquare.data('numerator', numerator);
      checkSquare.data('denominator', denominator);
      this.setObjectImage(checkSquare);
      this.checkSuccess();
      this.fireLaser(checkSquare);
    }
    if (occupied) {
      return false;
    }
    return true;
  };

  ViewHelper.prototype.checkSuccess = function() {
    var square, successMessage, _k, _len2, _ref;
    _ref = this.$('.square.occupied');
    for (_k = 0, _len2 = _ref.length; _k < _len2; _k++) {
      square = _ref[_k];
      if (square.className.indexOf('ship') > -1) {
        if ($(square).html().indexOf('full') === -1) {
          return;
        }
      }
    }
    successMessage = this.$('.success');
    successMessage.css({
      top: this.el.offset().top + (this.el.height() / 2) - (successMessage.height() / 2),
      left: this.el.offset().left + (this.el.width() / 2) - (successMessage.width() / 2)
    });
    return successMessage.animate({
      opacity: 1,
      duration: 500
    });
  };

  ViewHelper.prototype.loadToPlay = function(data) {
    var attr, movableObjects, object, objectMeta, square, type, _k, _l, _len2, _len3, _ref, _ref1;
    this.solution = JSON.parse(data);
    movableObjects = [];
    _ref = this.solution.objects;
    for (_k = 0, _len2 = _ref.length; _k < _len2; _k++) {
      object = _ref[_k];
      objectMeta = this.objects[object.type];
      if (objectMeta.movable) {
        movableObjects.push(object.type);
      } else {
        square = this.board.find(".square.index" + object.index);
        this.addObjectToSquare(object.type, square);
        for (attr in object) {
          if (attr !== 'type' && attr !== 'index') {
            square.data(attr, object[attr]);
          }
        }
        this.showFraction(square);
        this.setObjectImage(square);
        this.fireLaser(square);
      }
    }
    _ref1 = shuffle(movableObjects);
    for (_l = 0, _len3 = _ref1.length; _l < _len3; _l++) {
      type = _ref1[_l];
      square = this.options.find(".square:not(.occupied)")[0];
      this.addObjectToSquare(type, square);
    }
    if (!this.solution.verified) {
      return alert('This level has not been verified as solvable.\n\nIt\'s possible that a solution may not exist');
    }
  };

  ViewHelper.prototype.fireLaser = function(square) {
    var acceptDirection, acceptDirections, beam, checkSquare, denominator, distributeDirection, distributeDirections, end, height, increment, laser, laserData, numerator, offset, squareIndex, start, width, _k, _l, _len2, _len3, _m, _n, _results;
    square = $(square);
    this.removeExistingLasers(square);
    if (!(distributeDirections = JSON.parse(square.data('distributeDirections') || null))) {
      return;
    }
    if ((acceptDirections = JSON.parse(square.data('acceptDirections') || null))) {
      if (!(laserData = JSON.parse(square.data('lasers') || null))) {
        return;
      }
      for (_k = 0, _len2 = acceptDirections.length; _k < _len2; _k++) {
        acceptDirection = acceptDirections[_k];
        if (!laserData[acceptDirection]) {
          return;
        }
      }
    }
    numerator = (square.data('numerator') || 1) * (square.data('numeratorMultiplier') || 1);
    denominator = (square.data('denominator') || 1) * (square.data('denominatorMultiplier') || 1);
    squareIndex = square.data('index');
    _results = [];
    for (_l = 0, _len3 = distributeDirections.length; _l < _len3; _l++) {
      distributeDirection = distributeDirections[_l];
      laser = $(document.createElement('DIV'));
      laser.html('<div class=\'beam\'></div>');
      laser.addClass('laser');
      laser.addClass("laser" + squareIndex);
      laser.addClass(distributeDirection);
      laser.data('numerator', numerator);
      laser.data('denominator', denominator);
      increment = (function() {
        switch (distributeDirection) {
          case 'up':
            return -1 * this.columns;
          case 'down':
            return this.columns;
          case 'left':
            return -1;
          case 'right':
            return 1;
        }
      }).call(this);
      start = square.data('index') + increment;
      end = (function() {
        switch (distributeDirection) {
          case 'up':
            return 0;
          case 'down':
            return this.board.find('.square').length;
          case 'left':
            return (Math.floor(start / this.columns) * this.columns) - 1;
          case 'right':
            return Math.ceil(start / this.columns) * this.columns;
        }
      }).call(this);
      offset = square.offset();
      beam = laser.find('.beam');
      if (distributeDirection === 'left' || distributeDirection === 'right') {
        height = LASER_HEIGHT * (numerator / denominator);
        width = 0;
        for (index = _m = start; start <= end ? _m < end : _m > end; index = _m += increment) {
          checkSquare = this.board.find(".square.index" + index);
          if (!this.checkLaserPath(checkSquare, squareIndex, distributeDirection, numerator, denominator)) {
            break;
          }
          width += checkSquare.width();
        }
      } else {
        width = LASER_HEIGHT * (numerator / denominator);
        height = 0;
        for (index = _n = start; start <= end ? _n < end : _n > end; index = _n += increment) {
          checkSquare = this.board.find(".square.index" + index);
          if (!this.checkLaserPath(checkSquare, squareIndex, distributeDirection, numerator, denominator)) {
            break;
          }
          height += checkSquare.height();
        }
      }
      beam.addClass(distributeDirection);
      beam.css({
        height: height,
        width: width
      });
      if (distributeDirection === 'right') {
        laser.css({
          top: offset.top + ((offset.height - height) / 2) - LASER_HEIGHT,
          left: offset.left + offset.width
        });
      } else if (distributeDirection === 'left') {
        laser.css({
          top: offset.top + ((offset.height - height) / 2) - LASER_HEIGHT,
          left: offset.left - width
        });
      } else if (distributeDirection === 'up') {
        laser.css({
          top: offset.top - height,
          left: offset.left + ((offset.width - width) / 2) - LASER_HEIGHT
        });
      } else if (distributeDirection === 'down') {
        laser.css({
          top: offset.top + offset.height,
          left: offset.left + ((offset.width - width) / 2) - LASER_HEIGHT
        });
      }
      this.showFraction(laser);
      _results.push(this.board.append(laser));
    }
    return _results;
  };

  return ViewHelper;

})();
