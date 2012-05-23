// Generated by CoffeeScript 1.3.1
var bcrypt, checkPassword, crypto, db, line, registrationTemplate, requireUser, soma, wings, _ref;

bcrypt = require('bcrypt');

crypto = require('crypto');

line = require('line');

soma = require('soma');

wings = require('wings');

db = require('../lib/db');

_ref = require('./lib/decorators'), checkPassword = _ref.checkPassword, requireUser = _ref.requireUser;

registrationTemplate = "{name}, \n\nWe just wanted to welcome you to Min.gl\n\nHope you enjoy it and meet some cool people.\n\nReally that's all we wanted to say. \n\nIf you have any questions, let us know.\n\nBest,\n    The Min.gl Team";

soma.routes({
  '/api/login': checkPassword(function() {
    var _this = this;
    line(function() {
      return db.get('users', _this.login.user, line.wait());
    });
    line(function(user) {
      var userCookie;
      _this.user = user;
      return userCookie = _this.cookies.get('user');
    });
    line(function() {
      return crypto.randomBytes(16, line.wait());
    });
    line(function(session) {
      return db.update('users', _this.user.id, {
        session: session.toString('hex')
      }, line.wait());
    });
    return line.run(function(user) {
      _this.user = user;
      _this.cookies.set('user', _this.user, {
        signed: true
      });
      return _this.send();
    });
  }),
  '/api/register': function() {
    var _this = this;
    if (!(this.data.name && /\S{3,}/.test(this.data.name))) {
      return this.sendError(new Error('Name was invalid'));
    }
    if (!(this.data.email && /.+@.+\..+/.test(this.data.email))) {
      return this.sendError(new Error('Email was invalid'));
    }
    if (!(this.data.password && /\S{3,}/.test(this.data.password))) {
      return this.sendError(new Error('Password was invalid'));
    }
    if (!(this.data.year && this.data.month && this.data.day && isFinite(this.data.year) && isFinite(this.data.month) && isFinite(this.data.day))) {
      return this.sendError(new Error('Birthday was invalid'));
    }
    this.data.birthday = "" + this.data.year + "-" + this.data.month + "-" + this.data.day;
    this.data.year = parseInt(this.data.year);
    this.data.month = parseInt(this.data.month);
    this.data.day = parseInt(this.data.day);
    this.data.email = this.data.email.toLowerCase();
    line(function() {
      return db.get('login', _this.data.email, line.wait(function(login) {
        if (login != null) {
          return line.fail('duplicate login');
        }
      }));
    });
    line(function() {
      return bcrypt.genSalt(line.wait());
    });
    line(function(salt) {
      return bcrypt.hash(_this.data.password, salt, line.wait());
    });
    line(function(hash) {
      _this.data.password = hash;
      return crypto.randomBytes(16, line.wait());
    });
    line(function(session) {
      var key, user, _i, _len, _ref1;
      user = {
        id: _this.data.email,
        session: session.toString('hex')
      };
      _ref1 = ['name', 'email', 'birthday', 'month', 'day', 'year'];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        key = _ref1[_i];
        user[key] = _this.data[key];
      }
      return db.put('users', user, line.wait());
    });
    line(function(user) {
      _this.user = user;
      _this.cookies.set('user', _this.user, {
        signed: true
      });
      return db.put('login', {
        id: _this.data.email,
        password: _this.data.password,
        user: _this.user.id
      }, line.wait());
    });
    line.error(function(err) {
      return _this.sendError(err, 'Registration failed');
    });
    return line.run(function() {
      return _this.send();
    });
  }
});
