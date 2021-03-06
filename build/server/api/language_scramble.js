// Generated by CoffeeScript 1.3.3
var Line, db, requireUser, soma;

Line = require('line').Line;

soma = require('soma');

db = require('../lib/db');

requireUser = require('./lib/decorators').requireUser;

soma.routes({
  '/api/language_scramble/translation/:id': function(_arg) {
    var id, l,
      _this = this;
    id = _arg.id;
    return l = new Line({
      error: function(err) {
        console.log('Error locating translation:', err);
        return _this.sendError();
      }
    }, function() {
      return db.get('language_scramble_translations', id, this.wait());
    }, function(translation) {
      return _this.send(translation);
    });
  },
  '/api/language_scramble/bundles': function() {
    var l,
      _this = this;
    return l = new Line({
      error: function(err) {
        console.log('Error retrieving bundles:', err);
        return _this.sendError();
      }
    }, function() {
      return db.get('language_scramble_translation_lists', 'bundles', this.wait());
    }, function(bundles) {
      return _this.send((bundles != null ? bundles.bundles : void 0) || []);
    });
  },
  '/api/language_scramble/bundle/:languages/:bundleName': function(_arg) {
    var bundleName, l, languages,
      _this = this;
    languages = _arg.languages, bundleName = _arg.bundleName;
    return l = new Line({
      error: function(err) {
        console.log('Error retrieving bundles:', err);
        return _this.sendError();
      }
    }, function() {
      return db.get('language_scramble_translation_bundles', "" + languages + "/" + bundleName, this.wait());
    }, function(bundle) {
      return _this.send(bundle || {});
    });
  },
  '/api/language_scramble/translations/save': function() {
    var bundleDescription, bundleNextLevels, existingTranslation, incompleteUpdates, l, languageBundle, languages, translated, translation, _ref, _ref1, _ref10, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9,
      _this = this;
    translation = {};
    if ((_ref = this.data.nativeLanguage) != null ? _ref.length : void 0) {
      translation.nativeLanguage = this.data.nativeLanguage;
    }
    if ((_ref1 = this.data.foreignLanguage) != null ? _ref1.length : void 0) {
      translation.foreignLanguage = this.data.foreignLanguage;
    }
    if ((_ref2 = this.data["native"]) != null ? _ref2.length : void 0) {
      translation["native"] = this.data["native"];
    }
    if ((_ref3 = this.data.foreign) != null ? _ref3.length : void 0) {
      translation.foreign = this.data.foreign;
    }
    if ((_ref4 = this.data.nativeSentence) != null ? _ref4.length : void 0) {
      translation.nativeSentence = this.data.nativeSentence;
    }
    if ((_ref5 = this.data.foreignSentence) != null ? _ref5.length : void 0) {
      translation.foreignSentence = this.data.foreignSentence;
    }
    translation.nativeVerified = ((_ref6 = this.data.nativeVerified) != null ? _ref6.length : void 0) ? this.data.nativeVerified : null;
    translation.foreignVerified = ((_ref7 = this.data.foreignVerified) != null ? _ref7.length : void 0) ? this.data.foreignVerified : null;
    if ((_ref8 = this.data.bundle) != null ? _ref8.length : void 0) {
      translation.bundle = this.data.bundle;
    }
    if ((_ref9 = this.data.bundleDescription) != null ? _ref9.length : void 0) {
      bundleDescription = this.data.bundleDescription;
    }
    if ((_ref10 = this.data.bundleNextLevels) != null ? _ref10.length : void 0) {
      bundleNextLevels = this.data.bundleNextLevels;
    }
    languages = "" + translation.nativeLanguage + "-" + translation.foreignLanguage;
    if (translation.bundle) {
      languageBundle = "" + languages + "/" + (translation.bundle.replace(/\s/g, '_'));
    }
    l = new Line({
      error: function(err) {
        console.log('Saving translation failed:', err);
        return _this.sendError();
      }
    });
    translated = translation["native"] && translation.foreign;
    incompleteUpdates = {
      noTranslation: {}
    };
    if (!translated) {
      incompleteUpdates.noTranslation.add = [JSON.stringify(translation)];
    } else {
      if (this.data.noTranslation) {
        incompleteUpdates.noTranslation["delete"] = [this.data.noTranslation];
      } else {
        delete incompleteUpdates.noTranslation;
      }
      translation.id = "" + (this.data["native"].replace(/\W/g, '_')) + "-" + (translation.foreign.replace(/\W/g, '_'));
      existingTranslation = null;
      l.add(function() {
        return db.get('language_scramble_translations', translation.id, l.wait());
      });
      l.add(function(existing) {
        var existingLanguageBundle;
        existingTranslation = existing || {};
        if (existingTranslation["native"] !== translation["native"] || existingTranslation.nativeSentence !== translation.nativeSentence) {
          translation.nativeVerified = 0;
        }
        if (existingTranslation.foreign !== translation.foreign || existingTranslation.foreignSentence !== translation.foreignSentence) {
          translation.foreignVerified = 0;
        }
        if (translation.nativeVerified != null) {
          incompleteUpdates.notNativeVerified = {};
          incompleteUpdates.notNativeVerified["" + (translation.nativeVerified ? 'delete' : 'add')] = [translation.id];
        }
        if (translation.foreignVerified != null) {
          incompleteUpdates.notForeignVerified = {};
          incompleteUpdates.notForeignVerified["" + (translation.foreignVerified ? 'delete' : 'add')] = [translation.id];
        }
        if (existingTranslation.bundle) {
          existingLanguageBundle = "" + existingTranslation.nativeLanguage + "-" + existingTranslation.foreignLanguage + "/" + (existingTranslation.bundle.replace(/\s/g, '_'));
        }
        return db.update('language_scramble_translations', translation.id, translation, l.wait());
      });
      l.add(function() {
        if (existingTranslation.bundle && translation.bundle && existingTranslation.bundle !== translation.bundle) {
          return db.update('language_scramble_translation_bundles', existingTranslation.bundle, {
            translations: {
              "delete": [translation.id]
            }
          }, l.wait());
        }
      });
      l.add(function(bundleInfo) {
        if (bundleInfo && bundleInfo.translations && !bundleInfo.translations.length) {
          return db["delete"]('language_scramble_translation_bundles', existingLanguageBundle, function() {
            return db.update('language_scramble_translation_lists', {
              languages: {
                "delete": [existingLanguageBundle]
              },
              'bundles': {
                "delete": [existingLanguageBundle]
              }
            }, l.wait());
          });
        }
      });
      l.add(function() {
        var bundleUpdate;
        if (existingTranslation.bundle && !translation.bundle) {
          return;
        }
        if (!translation.bundle) {
          return incompleteUpdates.noBundle = {
            add: [translation.id]
          };
        } else if (existingTranslation.bundle !== translation.bundle || (bundleDescription != null ? bundleDescription.length : void 0) || (bundleNextLevels != null ? bundleNextLevels.length : void 0)) {
          incompleteUpdates.noBundle = {
            "delete": [translation.id]
          };
          bundleUpdate = {
            name: translation.bundle,
            translations: {
              add: [translation.id]
            }
          };
          if (bundleDescription != null ? bundleDescription.length : void 0) {
            bundleUpdate.description = bundleDescription;
          }
          if (bundleNextLevels != null ? bundleNextLevels.length : void 0) {
            bundleUpdate.nextLevels = {
              add: JSON.parse(bundleNextLevels)
            };
          }
          return db.update('language_scramble_translation_bundles', languageBundle, bundleUpdate, l.wait());
        }
      });
      l.add(function() {
        var listUpdates;
        if (translation.nativeLanguage && translation.foreignLanguage && translation.bundle) {
          listUpdates = {};
          listUpdates['languages'] = {
            add: [languages]
          };
          listUpdates[languages] = {
            add: [languageBundle]
          };
          listUpdates['bundles'] = {
            add: [languageBundle]
          };
          return db.update('language_scramble_translation_lists', 'bundles', listUpdates, l.wait());
        }
      });
    }
    l.add(function() {
      return db.update('language_scramble_translation_lists', 'incomplete', incompleteUpdates, l.wait());
    });
    return l.add(function(incompleteStats) {
      return _this.send(incompleteStats);
    });
  },
  '/api/language_scramble/translations/incomplete': function() {
    var l,
      _this = this;
    return l = new Line({
      error: function(err) {
        console.log('Unable to load incomplete translation data:', err);
        return _this.send({});
      }
    }, function() {
      return db.get('language_scramble_translation_lists', 'incomplete', l.wait());
    }, function(incomplete) {
      return _this.send(incomplete);
    });
  }
});
