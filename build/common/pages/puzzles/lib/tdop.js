// Generated by CoffeeScript 1.3.3
var constants, fns, parse, tdop;

tdop = typeof exports !== "undefined" && exports !== null ? exports : provide('./lib/tdop', {});

tdop.makeParse = function() {
  var advance, expression, infix, itself, juxMult, originalSymbol, symbol, symbolTable, token, tokenNr, tokens, _ref;
  symbolTable = {};
  _ref = [null, null, null], token = _ref[0], tokens = _ref[1], tokenNr = _ref[2];
  originalSymbol = {
    nud: function() {
      return error('Undefined.', this);
    },
    led: function(left) {
      return error('Missing operator.', this);
    }
  };
  symbol = function(id, bp) {
    var s;
    s = symbolTable[id];
    bp || (bp = 0);
    if (s) {
      if (bp >= s.lbp) {
        s.lbp = bp;
      }
    } else {
      s = Object.create(originalSymbol);
      s.id = s.value = id;
      s.lbp = bp;
      symbolTable[id] = s;
    }
    return s;
  };
  symbol('(end)');
  juxMult = function(left) {
    return {
      value: '*',
      arity: 'binary',
      first: left,
      second: expression(60, this)
    };
  };
  itself = function() {
    return this;
  };
  symbol('(name)', 58).nud = itself;
  symbol('(name)').led = juxMult;
  symbol('(literal)', 60).nud = itself;
  symbol('(literal)').led = juxMult;
  advance = function(id) {
    var a, o, t, v;
    if (id && token.id !== id) {
      error("Expected '" + id + "'.", token);
    }
    if (tokenNr >= tokens.length) {
      token = symbolTable["(end)"];
      return;
    }
    t = tokens[tokenNr];
    tokenNr += 1;
    v = t.value;
    a = t.type;
    if (a === "name") {
      o = symbolTable["(name)"];
    } else if (a === "operator") {
      o = symbolTable[v];
      if (!o) {
        error("Unknown operator.", t);
      }
    } else if (a === "number") {
      a = "literal";
      o = symbolTable["(literal)"];
    } else {
      error("Unexpected token.", t);
    }
    token = Object.create(o);
    token.value = v;
    token.arity = a;
    return token;
  };
  expression = function(rbp, first) {
    var left, t;
    if (first) {
      left = first.nud();
    } else {
      t = token;
      advance();
      left = t.nud();
    }
    while (rbp < token.lbp) {
      t = token;
      advance();
      left = t.led(left);
    }
    return left;
  };
  infix = function(id, bp, led) {
    var s;
    s = symbol(id, bp);
    s.led = led || function(left) {
      this.first = left;
      this.second = expression(bp);
      this.arity = "binary";
      return this;
    };
    return s;
  };
  infix("+", 50);
  infix("-", 50);
  infix("*", 60);
  infix("/", 60);
  infix("^", 70);
  infix("=", 40);
  symbol('(').nud = function() {
    var e;
    e = expression(0);
    advance(')');
    return e;
  };
  symbol('(', 61).led = function(left) {
    var e;
    e = expression(0);
    advance(')');
    if (fns[left.value]) {
      left.arity = 'function';
      left.arg = e;
      return left;
    } else {
      return {
        value: '*',
        arity: 'binary',
        first: left,
        second: e
      };
    }
  };
  symbol(')');
  symbol('-').nud = function() {
    return {
      value: '-',
      arity: 'binary',
      first: {
        value: 0,
        arity: 'literal'
      },
      second: expression(65)
    };
  };
  return function(source) {
    var s;
    tokens = source.tokens('=<>/+-*%^()xym');
    tokenNr = 0;
    advance();
    s = expression(0);
    advance('(end)');
    return s;
  };
};

tdop.toSexp = function(v) {
  if (v.arity === 'literal' || v.arity === 'number' || v.arity === 'name') {
    return v.value;
  } else if (v.arity === 'binary') {
    return '(' + v.value + ' ' + tdop.toSexp(v.first) + ' ' + tdop.toSexp(v.second) + ')';
  } else if (v.arity === 'function') {
    return '(' + v.value + ' ' + tdop.toSexp(v.arg) + ')';
  }
};

tdop.toJs = function(exp, boundVars, freeVars, fns) {
  var expToJs;
  expToJs = function(v) {
    if (v.arity === 'literal' || v.arity === 'number') {
      return v.value;
    }
    if (v.arity === 'name') {
      if (boundVars.indexOf(v.value) !== -1) {
        return v.value;
      }
      if (freeVars[v.value] !== void 0) {
        return freeVars[v.value];
      } else {
        return error('Undefined variable or constant', v);
      }
    } else if (v.arity === 'binary') {
      if (v.value === '^') {
        return 'Math.pow(' + expToJs(v.first) + ',' + expToJs(v.second) + ')';
      } else {
        return '(' + expToJs(v.first) + ' ' + v.value + ' ' + expToJs(v.second) + ')';
      }
    } else if (v.arity === 'function') {
      if (fns[v.value]) {
        return fns[v.value] + '(' + ' ' + expToJs(v.arg) + ')';
      } else {
        return error('Undefined function: ' + v.value, v);
      }
    }
  };
  return expToJs(exp);
};

fns = {
  'sin': 'Math.sin',
  'cos': 'Math.cos',
  'tan': 'Math.tan',
  'round': 'Math.round',
  'sqrt': 'Math.sqrt',
  'abs': 'Math.abs',
  'ln': 'Math.log',
  'atan': 'Math.atan',
  'acos': 'Math.acos',
  'asin': 'Math.asin'
};

constants = {
  'pi': 'Math.PI',
  'e': 'Math.E'
};

parse = tdop.makeParse();

tdop.compileToJsInequality = function(equation, m) {
  var c, parts;
  c = Object.create(constants);
  c.m = m;
  parts = equation.split('=');
  if (parts.length === 1) {
    eval('function f(x, y){ return (y<' + tdop.toJs(parse(parts[0]), ['x', 'y'], c, fns) + ')}');
  } else {
    eval('function f(x, y){ return (' + tdop.toJs(parse(parts[0]), ['x', 'y'], c, fns) + '<' + tdop.toJs(parse(parts[1]), ['x', 'y'], c, fns) + ')}');
  }
  return f;
};

tdop.compileToJs = function(equation, m) {
  var c, parts;
  c = Object.create(constants);
  c.m = m;
  parts = equation.split('=');
  if (parts.length === 1) {
    eval('function f(x){ return (' + tdop.toJs(parse(parts[0]), ['x', 'y'], c, fns) + ')}');
  } else {
    eval('function f(x){ return (' + tdop.toJs(parse(parts[1]), ['x', 'y'], c, fns) + ')}');
  }
  return f;
};
