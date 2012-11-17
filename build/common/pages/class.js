// Generated by CoffeeScript 1.3.3
var soma, wings;

soma = require('soma');

wings = require('wings');

soma.chunks({
  Class: {
    meta: function() {
      return new soma.chunks.Base({
        content: this
      });
    },
    prepare: function(_arg) {
      var _this = this;
      this.id = _arg.id;
      this.template = this.loadTemplate('/build/common/templates/class.html');
      if (this.id) {
        return this.loadData({
          url: "/api/classes/info/" + this.id,
          success: function(data) {
            return _this.classInfo = data;
          },
          error: function() {
            if (typeof window !== "undefined" && window !== null ? window.alert : void 0) {
              return alert('We were unable to load the information for this class. Please check your internet connection.');
            }
          }
        });
      }
    },
    build: function() {
      var _ref, _ref1;
      this.setTitle("Your Class - The Puzzle School");
      return this.html = wings.renderTemplate(this.template, {
        id: (_ref = this.classInfo) != null ? _ref.id : void 0,
        className: ((_ref1 = this.classInfo) != null ? _ref1.name : void 0) || 'New Class',
        newClass: !(this.classInfo != null)
      });
    }
  }
});

soma.views({
  Class: {
    selector: '#content .class',
    create: function() {
      var _this = this;
      $('.register_flag').hide();
      this.$('form').bind('submit', function(e) {
        return e.stop();
      });
      this.$('button').bind('click', function(e) {
        return e.stop();
      });
      this.classInfo = {
        id: this.el.data('id')
      };
      this.initSaveClass();
      return this.initAddALevel();
    },
    initSaveClass: function() {
      var _this = this;
      this.$('.class_update').bind('submit', function() {
        return _this.saveClass();
      });
      this.$('.save_button').bind('click', function() {
        return _this.saveClass();
      });
      return this.$('.cancel_button').bind('click', function() {
        return _this.go('/');
      });
    },
    saveClass: function() {
      var dataHash,
        _this = this;
      dataHash = this.$('.class_update').data('form').dataHash();
      dataHash.id = this.el.data('id');
      return $.ajaj({
        url: '/api/classes/update',
        method: 'POST',
        headers: {
          'X-CSRF-Token': this.cookies.get('_csrf', {
            raw: true
          })
        },
        data: dataHash,
        success: function(classInfo) {
          return _this.go("/class/" + classInfo.id);
        }
      });
    },
    initAddALevel: function() {
      var displayLevels, hideNewLevel,
        _this = this;
      this.puzzles = {
        fractions: {
          levels: []
        }
      };
      displayLevels = function(puzzle, area) {
        var level, _i, _len, _ref, _results;
        area.html('');
        _ref = _this.puzzles[puzzle].levels;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          level = _ref[_i];
          _results.push(area.append("<p>" + level.id + "</p>"));
        }
        return _results;
      };
      this.$('.add_a_level').bind('click', function(e) {
        var levelSelector;
        levelSelector = _this.$('.level_selector');
        levelSelector.css({
          opacity: 0,
          top: 100,
          left: 100
        });
        levelSelector.animate({
          opacity: 1,
          duration: 250
        });
        return $.ajaj({
          url: '/api/puzzles/fractions/levels',
          method: 'GET',
          headers: {
            'X-CSRF-Token': _this.cookies.get('_csrf', {
              raw: true
            })
          },
          success: function(levelData) {
            console.log(levelData);
            _this.puzzles.fractions.levels = levelData.levels || [];
            return displayLevels('fractions', levelSelector.find('.levels'));
          }
        });
      });
      this.$('.create_level').bind('click', function(e) {
        var link, newLevel;
        link = $(e.currentTarget);
        newLevel = link.closest('.level_selector').find('.new_level');
        newLevel.css({
          display: 'block'
        });
        return newLevel.animate({
          opacity: 1,
          duration: 250
        });
      });
      hideNewLevel = function(newLevel) {
        return newLevel.animate({
          opacity: 0,
          duration: 250,
          complete: function() {
            return newLevel.css({
              display: 'none'
            });
          }
        });
      };
      this.$('.save_new_level_button').bind('click', function(e) {
        var dataHash, newLevel;
        newLevel = $(e.currentTarget).closest('.new_level');
        dataHash = newLevel.find('form').data('form').dataHash();
        dataHash.classId = _this.classInfo.id;
        return $.ajaj({
          url: '/api/puzzles/fractions/add_level',
          method: 'POST',
          headers: {
            'X-CSRF-Token': _this.cookies.get('_csrf', {
              raw: true
            })
          },
          data: dataHash,
          success: function(levelInfo) {
            _this.puzzles.fractions.levels.push(levelInfo);
            displayLevels('fractions', newLevel.find('.levels'));
            return hideNewLevel(newLevel);
          }
        });
      });
      return this.$('.cancel_new_level_button').bind('click', function(e) {
        return hideNewLevel($(e.currentTarget).closest('.new_level'));
      });
    }
  }
});

soma.routes({
  '/class': function() {
    return new soma.chunks.Class;
  },
  '/class/:id': function(data) {
    return new soma.chunks.Class({
      id: data.id
    });
  }
});