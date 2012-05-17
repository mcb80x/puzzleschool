// Generated by CoffeeScript 1.3.1
var bcrypt, crypto, db, line;

bcrypt = require('bcrypt');

crypto = require('crypto');

line = require('line');

db = require('../../lib/db');

exports.checkPassword = function(fn) {
  return function() {
    var args,
      _this = this;
    args = Array.prototype.slice.call(arguments);
    if (this.user && !this.data.email) {
      this.data.email = this.user.email;
    }
    if (!(this.data.email && /.+@.+\..+/.test(this.data.email))) {
      return this.sendError();
    }
    if (!(this.data.password && /\S{3,}/.test(this.data.password))) {
      return this.sendError();
    }
    line(function() {
      return db.get('login', _this.data.email, line.wait());
    });
    line(function(login) {
      _this.login = login;
      if (!_this.login) {
        return line.fail('Login failed, email not on record.');
      }
      return bcrypt.compare(_this.data.password, _this.login.password, line.wait());
    });
    line(function(result) {
      if (!result) {
        return line.fail('Login failed, invalid password');
      }
    });
    line.error(function() {
      return _this.sendError();
    });
    return line.run(function() {
      return fn.apply(_this, args);
    });
  };
};

exports.requireUser = function(fn) {
  return function() {
    var args, userCookie,
      _this = this;
    args = Array.prototype.slice.call(arguments);
    userCookie = this.cookies.get('user', {
      signed: true
    });
    if (!userCookie) {
      return this.go('/');
    }
    line(function() {
      return db.get('users', userCookie.id, line.wait());
    });
    line(function(user) {
      _this.user = user;
      if (!_this.user || _this.user.session !== userCookie.session) {
        _this.cookies.set('user', null);
        return _this.go('/');
      } else {
        _this.cookies.set('user', _this.user, {
          signed: true
        });
        return fn.apply(_this, args);
      }
    });
    line.error(function(err) {
      throw err;
    });
    return line.run();
  };
};
