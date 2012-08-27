// Generated by CoffeeScript 1.3.3

window.app = {
  initialize: function() {
    var languageScramble,
      _this = this;
    document.addEventListener('touchmove', (function(e) {
      return e.preventDefault();
    }), false);
    languageScramble = require('./lib/language_scramble');
    this.selector = $('.language_scramble');
    $('.scramble_content').height(window.innerHeight);
    this.puzzleData = JSON.parse(window.localStorage.getItem('data')) || {
      levels: {}
    };
    this.languages = "english_italian";
    if (!this.puzzleData.levels[this.languages]) {
      this.puzzleData.levels[this.languages] = {};
    }
    this.levelName = this.puzzleData.lastLevelPlayed || "top10words";
    this.viewHelper = new languageScramble.ViewHelper({
      el: $(this.selector),
      puzzleData: this.puzzleData,
      languages: this.languages,
      saveProgress: function(puzzleProgress) {
        return _this.saveProgress(puzzleProgress);
      },
      maxLevel: 5
    });
    this.initProgressMeter();
    this.initMenuButton();
    this.viewHelper.setLevel(this.levelName);
    this.viewHelper.bindWindow();
    this.viewHelper.bindKeyPress();
    return this.viewHelper.newScramble();
  },
  initProgressMeter: function() {
    this.progressMeter = this.viewHelper.$('.level_progress_meter');
    this.percentComplete = this.progressMeter.find('.percent_complete');
    return this.progressMeter.css({
      top: window.innerHeight - this.percentComplete.height()
    });
  },
  saveProgress: function(puzzleProgress) {
    var percentComplete, _ref;
    percentComplete = 0;
    if ((_ref = puzzleProgress.levels[this.languages][puzzleProgress.lastLevelPlayed]) != null ? _ref.percentComplete : void 0) {
      percentComplete = puzzleProgress.levels[this.languages][puzzleProgress.lastLevelPlayed].percentComplete;
    }
    this.percentComplete.width("" + percentComplete + "%");
    return window.localStorage.setItem("data", JSON.stringify(puzzleProgress));
  },
  initMenuButton: function() {
    var key, levelSelect, showLevel, startPosition, _fn,
      _this = this;
    levelSelect = this.selector.find('#level_select_menu');
    levelSelect.width($('.language_scramble').width());
    levelSelect.height($('.language_scramble').height());
    startPosition = {};
    levelSelect.bind('touchstart', function(e) {
      return startPosition = {
        scrollTop: parseInt(levelSelect.scrollTop()),
        touch: _this.viewHelper.clientY(e)
      };
    });
    levelSelect.bind('touchmove', function(e) {
      return levelSelect.scrollTop(startPosition.scrollTop - (_this.viewHelper.clientY(e) - startPosition.touch));
    });
    showLevel = function(level) {
      _this.viewHelper.setLevel(level);
      _this.viewHelper.newScramble();
      return levelSelect.animate({
        opacity: 0,
        duration: 500,
        complete: function() {
          return levelSelect.css({
            top: -1000,
            left: -1000
          });
        }
      });
    };
    _fn = function(key) {
      var info, levelLink, levelLinkDiv, levelProgress, percentComplete, _ref;
      info = languageScramble.data[_this.languages].levels[key];
      levelLinkDiv = document.createElement("DIV");
      levelLinkDiv.className = 'level';
      levelLinkDiv.id = "level_link_" + key;
      levelLink = document.createElement("A");
      levelLink.className = 'level_link';
      levelLink.innerHTML = "" + info.title + "<br/><small>" + info.subtitle + "</small>";
      $(levelLink).bind('click', function() {
        return showLevel(key);
      });
      $(levelLinkDiv).append(levelLink);
      levelSelect.append(levelLinkDiv);
      levelProgress = document.createElement("A");
      levelProgress.className = 'percent_complete';
      levelProgress.innerHTML = '&nbsp;';
      percentComplete = ((_ref = _this.puzzleData.levels[_this.languages][key]) != null ? _ref.percentComplete : void 0) || 0;
      $(levelProgress).width("" + percentComplete + "%");
      $(levelProgress).bind('click', function() {
        return showLevel(key);
      });
      return $(levelLinkDiv).append(levelProgress);
    };
    for (key in languageScramble.data[this.languages].levels) {
      _fn(key);
    }
    return this.selector.find('#menu_button').bind('click', function() {
      levelSelect.css({
        top: ($('.language_scramble').height() - levelSelect.height()) / 2,
        left: ($('.language_scramble').width() - levelSelect.width()) / 2
      });
      return levelSelect.animate({
        opacity: 1,
        duration: 500
      });
    });
  }
};
