/*! RESOURCE: /scripts/doctype/js_includes_navigator_doctype.js */
/*! RESOURCE: /scripts/lib/prototype.min.js */
/*!
 *  Prototype JavaScript framework, version 1.7
 *  (c) 2005-2010 Sam Stephenson
 *
 *  Prototype is freely distributable under the terms of an MIT-style license.
 *  For details, see the Prototype web site: http://www.prototypejs.org/
 *
 */
var Prototype = {
  Version: "1.7",
  Browser: (function() {
    var b = navigator.userAgent;
    var a = Object.prototype.toString.call(window.opera) == "[object Opera]";
    return {
      IE: !!window.attachEvent && !a,
      Opera: a,
      WebKit: b.indexOf("AppleWebKit/") > -1,
      Gecko: b.indexOf("Gecko") > -1 && b.indexOf("KHTML") === -1,
      MobileSafari: /Apple.*Mobile/.test(b)
    }
  })(),
  BrowserFeatures: {
    XPath: !!document.evaluate,
    SelectorsAPI: !!document.querySelector,
    ElementExtensions: (function() {
      var a = window.Element || window.HTMLElement;
      return !!(a && a.prototype)
    })(),
    SpecificElementExtensions: (function() {
      if (typeof window.HTMLDivElement !== "undefined") {
        return true
      }
      var c = document.createElement("div"),
        b = document.createElement("form"),
        a = false;
      if (c.__proto__ && (c.__proto__ !== b.__proto__)) {
        a = true
      }
      c = b = null;
      return a
    })()
  },
  ScriptFragment: "<script[^>]*>([\\S\\s]*?)<\/script>",
  JSONFilter: /^\/\*-secure-([\s\S]*)\*\/\s*$/,
  emptyFunction: function() {},
  K: function(a) {
    return a
  }
};
if (Prototype.Browser.MobileSafari) {
  Prototype.BrowserFeatures.SpecificElementExtensions = false
}
var Abstract = {};
var Try = {
  these: function() {
    var c;
    for (var b = 0, d = arguments.length; b < d; b++) {
      var a = arguments[b];
      try {
        c = a();
        break
      } catch (f) {}
    }
    return c
  }
};
var Class = (function() {
  var d = (function() {
    for (var e in {
        toString: 1
      }) {
      if (e === "toString") {
        return false
      }
    }
    return true
  })();

  function a() {}

  function b() {
    var h = null,
      g = $A(arguments);
    if (Object.isFunction(g[0])) {
      h = g.shift()
    }

    function e() {
      this.initialize.apply(this, arguments)
    }
    Object.extend(e, Class.Methods);
    e.superclass = h;
    e.subclasses = [];
    if (h) {
      a.prototype = h.prototype;
      e.prototype = new a;
      h.subclasses.push(e)
    }
    for (var f = 0, j = g.length; f < j; f++) {
      e.addMethods(g[f])
    }
    if (!e.prototype.initialize) {
      e.prototype.initialize = Prototype.emptyFunction
    }
    e.prototype.constructor = e;
    return e
  }

  function c(l) {
    var g = this.superclass && this.superclass.prototype,
      f = Object.keys(l);
    if (d) {
      if (l.toString != Object.prototype.toString) {
        f.push("toString")
      }
      if (l.valueOf != Object.prototype.valueOf) {
        f.push("valueOf")
      }
    }
    for (var e = 0, h = f.length; e < h; e++) {
      var k = f[e],
        j = l[k];
      if (g && Object.isFunction(j) && j.argumentNames()[0] == "$super") {
        var m = j;
        j = (function(i) {
          return function() {
            return g[i].apply(this, arguments)
          }
        })(k).wrap(m);
        j.valueOf = m.valueOf.bind(m);
        j.toString = m.toString.bind(m)
      }
      this.prototype[k] = j
    }
    return this
  }
  return {
    create: b,
    Methods: {
      addMethods: c
    }
  }
})();
(function() {
  var C = Object.prototype.toString,
    B = "Null",
    o = "Undefined",
    v = "Boolean",
    f = "Number",
    s = "String",
    H = "Object",
    t = "[object Function]",
    y = "[object Boolean]",
    g = "[object Number]",
    l = "[object String]",
    h = "[object Array]",
    x = "[object Date]",
    i = window.JSON && typeof JSON.stringify === "function" && JSON.stringify(0) === "0" && typeof JSON.stringify(Prototype.K) === "undefined";

  function k(J) {
    switch (J) {
      case null:
        return B;
      case (void 0):
        return o
    }
    var I = typeof J;
    switch (I) {
      case "boolean":
        return v;
      case "number":
        return f;
      case "string":
        return s
    }
    return H
  }

  function z(I, K) {
    for (var J in K) {
      I[J] = K[J]
    }
    return I
  }

  function G(I) {
    try {
      if (c(I)) {
        return "undefined"
      }
      if (I === null) {
        return "null"
      }
      return I.inspect ? I.inspect() : String(I)
    } catch (J) {
      if (J instanceof RangeError) {
        return "..."
      }
      throw J
    }
  }

  function D(I) {
    return F("", {
      "": I
    }, [])
  }

  function F(R, O, P) {
    var Q = O[R],
      N = typeof Q;
    if (k(Q) === H && typeof Q.toJSON === "function") {
      Q = Q.toJSON(R)
    }
    var K = C.call(Q);
    switch (K) {
      case g:
      case y:
      case l:
        Q = Q.valueOf()
    }
    switch (Q) {
      case null:
        return "null";
      case true:
        return "true";
      case false:
        return "false"
    }
    N = typeof Q;
    switch (N) {
      case "string":
        return Q.inspect(true);
      case "number":
        return isFinite(Q) ? String(Q) : "null";
      case "object":
        for (var J = 0, I = P.length; J < I; J++) {
          if (P[J] === Q) {
            throw new TypeError()
          }
        }
        P.push(Q);
        var M = [];
        if (K === h) {
          for (var J = 0, I = Q.length; J < I; J++) {
            var L = F(J, Q, P);
            M.push(typeof L === "undefined" ? "null" : L)
          }
          M = "[" + M.join(",") + "]"
        } else {
          var S = Object.keys(Q);
          for (var J = 0, I = S.length; J < I; J++) {
            var R = S[J],
              L = F(R, Q, P);
            if (typeof L !== "undefined") {
              M.push(R.inspect(true) + ":" + L)
            }
          }
          M = "{" + M.join(",") + "}"
        }
        P.pop();
        return M
    }
  }

  function w(I) {
    return JSON.stringify(I)
  }

  function j(I) {
    return $H(I).toQueryString()
  }

  function p(I) {
    return I && I.toHTML ? I.toHTML() : String.interpret(I)
  }

  function r(I) {
    if (k(I) !== H) {
      throw new TypeError()
    }
    var J = [];
    for (var K in I) {
      if (I.hasOwnProperty(K)) {
        J.push(K)
      }
    }
    return J
  }

  function d(I) {
    var J = [];
    for (var K in I) {
      J.push(I[K])
    }
    return J
  }

  function A(I) {
    return z({}, I)
  }

  function u(I) {
    return !!(I && I.nodeType == 1)
  }

  function m(I) {
    return C.call(I) === h
  }
  var b = (typeof Array.isArray == "function") && Array.isArray([]) && !Array.isArray({});
  if (b) {
    m = Array.isArray
  }

  function e(I) {
    return I instanceof Hash
  }

  function a(I) {
    return C.call(I) === t
  }

  function n(I) {
    return C.call(I) === l
  }

  function q(I) {
    return C.call(I) === g
  }

  function E(I) {
    return C.call(I) === x
  }

  function c(I) {
    return typeof I === "undefined"
  }
  z(Object, {
    extend: z,
    inspect: G,
    toJSON: i ? w : D,
    toQueryString: j,
    toHTML: p,
    keys: Object.keys || r,
    values: d,
    clone: A,
    isElement: u,
    isArray: m,
    isHash: e,
    isFunction: a,
    isString: n,
    isNumber: q,
    isDate: E,
    isUndefined: c
  })
})();
Object.extend(Function.prototype, (function() {
  var k = Array.prototype.slice;

  function d(o, l) {
    var n = o.length,
      m = l.length;
    while (m--) {
      o[n + m] = l[m]
    }
    return o
  }

  function i(m, l) {
    m = k.call(m, 0);
    return d(m, l)
  }

  function g() {
    var l = this.toString().match(/^[\s\(]*function[^(]*\(([^)]*)\)/)[1].replace(/\/\/.*?[\r\n]|\/\*(?:.|[\r\n])*?\*\//g, "").replace(/\s+/g, "").split(",");
    return l.length == 1 && !l[0] ? [] : l
  }

  function h(n) {
    if (arguments.length < 2 && Object.isUndefined(arguments[0])) {
      return this
    }
    var l = this,
      m = k.call(arguments, 1);
    return function() {
      var o = i(m, arguments);
      return l.apply(n, o)
    }
  }

  function f(n) {
    var l = this,
      m = k.call(arguments, 1);
    return function(p) {
      var o = d([p || window.event], m);
      return l.apply(n, o)
    }
  }

  function j() {
    if (!arguments.length) {
      return this
    }
    var l = this,
      m = k.call(arguments, 0);
    return function() {
      var n = i(m, arguments);
      return l.apply(this, n)
    }
  }

  function e(n) {
    var l = this,
      m = k.call(arguments, 1);
    n = n * 1000;
    return window.setTimeout(function() {
      return l.apply(l, m)
    }, n)
  }

  function a() {
    var l = d([0.01], arguments);
    return this.delay.apply(this, l)
  }

  function c(m) {
    var l = this;
    return function() {
      var n = d([l.bind(this)], arguments);
      return m.apply(this, n)
    }
  }

  function b() {
    if (this._methodized) {
      return this._methodized
    }
    var l = this;
    return this._methodized = function() {
      var m = d([this], arguments);
      return l.apply(null, m)
    }
  }
  return {
    argumentNames: g,
    bind: h,
    bindAsEventListener: f,
    curry: j,
    delay: e,
    defer: a,
    wrap: c,
    methodize: b
  }
})());
(function(c) {
  function b() {
    return this.getUTCFullYear() + "-" + (this.getUTCMonth() + 1).toPaddedString(2) + "-" + this.getUTCDate().toPaddedString(2) + "T" + this.getUTCHours().toPaddedString(2) + ":" + this.getUTCMinutes().toPaddedString(2) + ":" + this.getUTCSeconds().toPaddedString(2) + "Z"
  }

  function a() {
    return this.toISOString()
  }
  if (!c.toISOString) {
    c.toISOString = b
  }
  if (!c.toJSON) {
    c.toJSON = a
  }
})(Date.prototype);
RegExp.prototype.match = RegExp.prototype.test;
RegExp.escape = function(a) {
  return String(a).replace(/([.*+?^=!:()|[\]\/\\])/g, "\\$1")
};
var PeriodicalExecuter = Class.create({
  initialize: function(b, a) {
    this.callback = b;
    this.frequency = a;
    this.currentlyExecuting = false;
    this.registerCallback()
  },
  registerCallback: function() {
    this.timer = setInterval(this.onTimerEvent.bind(this), this.frequency * 1000)
  },
  execute: function() {
    this.callback(this)
  },
  stop: function() {
    if (!this.timer) {
      return
    }
    clearInterval(this.timer);
    this.timer = null
  },
  onTimerEvent: function() {
    if (!this.currentlyExecuting) {
      try {
        this.currentlyExecuting = true;
        this.execute();
        this.currentlyExecuting = false
      } catch (a) {
        this.currentlyExecuting = false;
        throw a
      }
    }
  }
});
Object.extend(String, {
  interpret: function(a) {
    return a == null ? "" : String(a)
  },
  specialChar: {
    "\b": "\\b",
    "\t": "\\t",
    "\n": "\\n",
    "\f": "\\f",
    "\r": "\\r",
    "\\": "\\\\"
  }
});
Object.extend(String.prototype, (function() {
  var NATIVE_JSON_PARSE_SUPPORT = window.JSON && typeof JSON.parse === "function" && JSON.parse('{"test": true}').test;

  function prepareReplacement(replacement) {
    if (Object.isFunction(replacement)) {
      return replacement
    }
    var template = new Template(replacement);
    return function(match) {
      return template.evaluate(match)
    }
  }

  function gsub(pattern, replacement) {
    var result = "",
      source = this,
      match;
    replacement = prepareReplacement(replacement);
    if (Object.isString(pattern)) {
      pattern = RegExp.escape(pattern)
    }
    if (!(pattern.length || pattern.source)) {
      replacement = replacement("");
      return replacement + source.split("").join(replacement) + replacement
    }
    while (source.length > 0) {
      if (match = source.match(pattern)) {
        result += source.slice(0, match.index);
        result += String.interpret(replacement(match));
        source = source.slice(match.index + match[0].length)
      } else {
        result += source, source = ""
      }
    }
    return result
  }

  function sub(pattern, replacement, count) {
    replacement = prepareReplacement(replacement);
    count = Object.isUndefined(count) ? 1 : count;
    return this.gsub(pattern, function(match) {
      if (--count < 0) {
        return match[0]
      }
      return replacement(match)
    })
  }

  function scan(pattern, iterator) {
    this.gsub(pattern, iterator);
    return String(this)
  }

  function truncate(length, truncation) {
    length = length || 30;
    truncation = Object.isUndefined(truncation) ? "..." : truncation;
    return this.length > length ? this.slice(0, length - truncation.length) + truncation : String(this)
  }

  function strip() {
    return this.replace(/^\s+/, "").replace(/\s+$/, "")
  }

  function stripTags() {
    return this.replace(/<\w+(\s+("[^"]*"|'[^']*'|[^>])+)?>|<\/\w+>/gi, "")
  }

  function stripScripts() {
    return this.replace(new RegExp(Prototype.ScriptFragment, "img"), "")
  }

  function extractScripts() {
    var matchAll = new RegExp(Prototype.ScriptFragment, "img"),
      matchOne = new RegExp(Prototype.ScriptFragment, "im");
    return (this.match(matchAll) || []).map(function(scriptTag) {
      return (scriptTag.match(matchOne) || ["", ""])[1]
    })
  }

  function evalScripts() {
    return this.extractScripts().map(function(script) {
      return eval(script)
    })
  }

  function escapeHTML() {
    return this.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
  }

  function unescapeHTML() {
    return this.stripTags().replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&")
  }

  function toQueryParams(separator) {
    var match = this.strip().match(/([^?#]*)(#.*)?$/);
    if (!match) {
      return {}
    }
    return match[1].split(separator || "&").inject({}, function(hash, pair) {
      if ((pair = pair.split("="))[0]) {
        var key = decodeURIComponent(pair.shift()),
          value = pair.length > 1 ? pair.join("=") : pair[0];
        if (value != undefined) {
          value = decodeURIComponent(value)
        }
        if (key in hash) {
          if (!Object.isArray(hash[key])) {
            hash[key] = [hash[key]]
          }
          hash[key].push(value)
        } else {
          hash[key] = value
        }
      }
      return hash
    })
  }

  function toArray() {
    return this.split("")
  }

  function succ() {
    return this.slice(0, this.length - 1) + String.fromCharCode(this.charCodeAt(this.length - 1) + 1)
  }

  function times(count) {
    return count < 1 ? "" : new Array(count + 1).join(this)
  }

  function camelize() {
    return this.replace(/-+(.)?/g, function(match, chr) {
      return chr ? chr.toUpperCase() : ""
    })
  }

  function capitalize() {
    return this.charAt(0).toUpperCase() + this.substring(1).toLowerCase()
  }

  function underscore() {
    return this.replace(/::/g, "/").replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2").replace(/([a-z\d])([A-Z])/g, "$1_$2").replace(/-/g, "_").toLowerCase()
  }

  function dasherize() {
    return this.replace(/_/g, "-")
  }

  function inspect(useDoubleQuotes) {
    var escapedString = this.replace(/[\x00-\x1f\\]/g, function(character) {
      if (character in String.specialChar) {
        return String.specialChar[character]
      }
      return "\\u00" + character.charCodeAt().toPaddedString(2, 16)
    });
    if (useDoubleQuotes) {
      return '"' + escapedString.replace(/"/g, '\\"') + '"'
    }
    return "'" + escapedString.replace(/'/g, "\\'") + "'"
  }

  function unfilterJSON(filter) {
    return this.replace(filter || Prototype.JSONFilter, "$1")
  }

  function isJSON() {
    var str = this;
    if (str.blank()) {
      return false
    }
    str = str.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@");
    str = str.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]");
    str = str.replace(/(?:^|:|,)(?:\s*\[)+/g, "");
    return (/^[\],:{}\s]*$/).test(str)
  }

  function evalJSON(sanitize) {
    var json = this.unfilterJSON(),
      cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
    if (cx.test(json)) {
      json = json.replace(cx, function(a) {
        return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
      })
    }
    try {
      if (!sanitize || json.isJSON()) {
        return eval("(" + json + ")")
      }
    } catch (e) {}
    throw new SyntaxError("Badly formed JSON string: " + this.inspect())
  }

  function parseJSON() {
    var json = this.unfilterJSON();
    return JSON.parse(json)
  }

  function include(pattern) {
    return this.indexOf(pattern) > -1
  }

  function startsWith(pattern) {
    return this.lastIndexOf(pattern, 0) === 0
  }

  function endsWith(pattern) {
    var d = this.length - pattern.length;
    return d >= 0 && this.indexOf(pattern, d) === d
  }

  function empty() {
    return this == ""
  }

  function blank() {
    return /^\s*$/.test(this)
  }

  function interpolate(object, pattern) {
    return new Template(this, pattern).evaluate(object)
  }
  return {
    gsub: gsub,
    sub: sub,
    scan: scan,
    truncate: truncate,
    strip: String.prototype.trim || strip,
    stripTags: stripTags,
    stripScripts: stripScripts,
    extractScripts: extractScripts,
    evalScripts: evalScripts,
    escapeHTML: escapeHTML,
    unescapeHTML: unescapeHTML,
    toQueryParams: toQueryParams,
    parseQuery: toQueryParams,
    toArray: toArray,
    succ: succ,
    times: times,
    camelize: camelize,
    capitalize: capitalize,
    underscore: underscore,
    dasherize: dasherize,
    inspect: inspect,
    unfilterJSON: unfilterJSON,
    isJSON: isJSON,
    evalJSON: NATIVE_JSON_PARSE_SUPPORT ? parseJSON : evalJSON,
    include: include,
    startsWith: startsWith,
    endsWith: endsWith,
    empty: empty,
    blank: blank,
    interpolate: interpolate
  }
})());
var Template = Class.create({
  initialize: function(a, b) {
    this.template = a.toString();
    this.pattern = b || Template.Pattern
  },
  evaluate: function(a) {
    if (a && Object.isFunction(a.toTemplateReplacements)) {
      a = a.toTemplateReplacements()
    }
    return this.template.gsub(this.pattern, function(d) {
      if (a == null) {
        return (d[1] + "")
      }
      var f = d[1] || "";
      if (f == "\\") {
        return d[2]
      }
      var b = a,
        g = d[3],
        e = /^([^.[]+|\[((?:.*?[^\\])?)\])(\.|\[|$)/;
      d = e.exec(g);
      if (d == null) {
        return f
      }
      while (d != null) {
        var c = d[1].startsWith("[") ? d[2].replace(/\\\\]/g, "]") : d[1];
        b = b[c];
        if (null == b || "" == d[3]) {
          break
        }
        g = g.substring("[" == d[3] ? d[1].length : d[0].length);
        d = e.exec(g)
      }
      return f + String.interpret(b)
    })
  }
});
Template.Pattern = /(^|.|\r|\n)(#\{(.*?)\})/;
var $break = {};
var Enumerable = (function() {
  function c(y, x) {
    var w = 0;
    try {
      this._each(function(A) {
        y.call(x, A, w++)
      })
    } catch (z) {
      if (z != $break) {
        throw z
      }
    }
    return this
  }

  function r(z, y, x) {
    var w = -z,
      A = [],
      B = this.toArray();
    if (z < 1) {
      return B
    }
    while ((w += z) < B.length) {
      A.push(B.slice(w, w + z))
    }
    return A.collect(y, x)
  }

  function b(y, x) {
    y = y || Prototype.K;
    var w = true;
    this.each(function(A, z) {
      w = w && !!y.call(x, A, z);
      if (!w) {
        throw $break
      }
    });
    return w
  }

  function i(y, x) {
    y = y || Prototype.K;
    var w = false;
    this.each(function(A, z) {
      if (w = !!y.call(x, A, z)) {
        throw $break
      }
    });
    return w
  }

  function j(y, x) {
    y = y || Prototype.K;
    var w = [];
    this.each(function(A, z) {
      w.push(y.call(x, A, z))
    });
    return w
  }

  function t(y, x) {
    var w;
    this.each(function(A, z) {
      if (y.call(x, A, z)) {
        w = A;
        throw $break
      }
    });
    return w
  }

  function h(y, x) {
    var w = [];
    this.each(function(A, z) {
      if (y.call(x, A, z)) {
        w.push(A)
      }
    });
    return w
  }

  function g(z, y, x) {
    y = y || Prototype.K;
    var w = [];
    if (Object.isString(z)) {
      z = new RegExp(RegExp.escape(z))
    }
    this.each(function(B, A) {
      if (z.match(B)) {
        w.push(y.call(x, B, A))
      }
    });
    return w
  }

  function a(w) {
    if (Object.isFunction(this.indexOf)) {
      if (this.indexOf(w) != -1) {
        return true
      }
    }
    var x = false;
    this.each(function(y) {
      if (y == w) {
        x = true;
        throw $break
      }
    });
    return x
  }

  function q(x, w) {
    w = Object.isUndefined(w) ? null : w;
    return this.eachSlice(x, function(y) {
      while (y.length < x) {
        y.push(w)
      }
      return y
    })
  }

  function l(w, y, x) {
    this.each(function(A, z) {
      w = y.call(x, w, A, z)
    });
    return w
  }

  function v(x) {
    var w = $A(arguments).slice(1);
    return this.map(function(y) {
      return y[x].apply(y, w)
    })
  }

  function p(y, x) {
    y = y || Prototype.K;
    var w;
    this.each(function(A, z) {
      A = y.call(x, A, z);
      if (w == null || A >= w) {
        w = A
      }
    });
    return w
  }

  function n(y, x) {
    y = y || Prototype.K;
    var w;
    this.each(function(A, z) {
      A = y.call(x, A, z);
      if (w == null || A < w) {
        w = A
      }
    });
    return w
  }

  function e(z, x) {
    z = z || Prototype.K;
    var y = [],
      w = [];
    this.each(function(B, A) {
      (z.call(x, B, A) ? y : w).push(B)
    });
    return [y, w]
  }

  function f(x) {
    var w = [];
    this.each(function(y) {
      w.push(y[x])
    });
    return w
  }

  function d(y, x) {
    var w = [];
    this.each(function(A, z) {
      if (!y.call(x, A, z)) {
        w.push(A)
      }
    });
    return w
  }

  function m(x, w) {
    return this.map(function(z, y) {
      return {
        value: z,
        criteria: x.call(w, z, y)
      }
    }).sort(function(B, A) {
      var z = B.criteria,
        y = A.criteria;
      return z < y ? -1 : z > y ? 1 : 0
    }).pluck("value")
  }

  function o() {
    return this.map()
  }

  function s() {
    var x = Prototype.K,
      w = $A(arguments);
    if (Object.isFunction(w.last())) {
      x = w.pop()
    }
    var y = [this].concat(w).map($A);
    return this.map(function(A, z) {
      return x(y.pluck(z))
    })
  }

  function k() {
    return this.toArray().length
  }

  function u() {
    return "#<Enumerable:" + this.toArray().inspect() + ">"
  }
  return {
    each: c,
    eachSlice: r,
    all: b,
    every: b,
    any: i,
    some: i,
    collect: j,
    map: j,
    detect: t,
    findAll: h,
    select: h,
    filter: h,
    grep: g,
    include: a,
    member: a,
    inGroupsOf: q,
    inject: l,
    invoke: v,
    max: p,
    min: n,
    partition: e,
    pluck: f,
    reject: d,
    sortBy: m,
    toArray: o,
    entries: o,
    zip: s,
    size: k,
    inspect: u,
    find: t
  }
})();

function $A(c) {
  if (!c) {
    return []
  }
  if ("toArray" in Object(c)) {
    return c.toArray()
  }
  var b = c.length || 0,
    a = new Array(b);
  while (b--) {
    a[b] = c[b]
  }
  return a
}

function $w(a) {
  if (!Object.isString(a)) {
    return []
  }
  a = a.strip();
  return a ? a.split(/\s+/) : []
}
Array.from = $A;
(function() {
  var r = Array.prototype,
    m = r.slice,
    o = r.forEach;

  function b(w, v) {
    for (var u = 0, x = this.length >>> 0; u < x; u++) {
      if (u in this) {
        w.call(v, this[u], u, this)
      }
    }
  }
  if (!o) {
    o = b
  }

  function l() {
    this.length = 0;
    return this
  }

  function d() {
    return this[0]
  }

  function g() {
    return this[this.length - 1]
  }

  function i() {
    return this.select(function(u) {
      return u != null
    })
  }

  function t() {
    return this.inject([], function(v, u) {
      if (Object.isArray(u)) {
        return v.concat(u.flatten())
      }
      v.push(u);
      return v
    })
  }

  function h() {
    var u = m.call(arguments, 0);
    return this.select(function(v) {
      return !u.include(v)
    })
  }

  function f(u) {
    return (u === false ? this.toArray() : this)._reverse()
  }

  function k(u) {
    return this.inject([], function(x, w, v) {
      if (0 == v || (u ? x.last() != w : !x.include(w))) {
        x.push(w)
      }
      return x
    })
  }

  function p(u) {
    return this.uniq().findAll(function(v) {
      return u.detect(function(w) {
        return v === w
      })
    })
  }

  function q() {
    return m.call(this, 0)
  }

  function j() {
    return this.length
  }

  function s() {
    return "[" + this.map(Object.inspect).join(", ") + "]"
  }

  function a(w, u) {
    u || (u = 0);
    var v = this.length;
    if (u < 0) {
      u = v + u
    }
    for (; u < v; u++) {
      if (this[u] === w) {
        return u
      }
    }
    return -1
  }

  function n(v, u) {
    u = isNaN(u) ? this.length : (u < 0 ? this.length + u : u) + 1;
    var w = this.slice(0, u).reverse().indexOf(v);
    return (w < 0) ? w : u - w - 1
  }

  function c() {
    var z = m.call(this, 0),
      x;
    for (var v = 0, w = arguments.length; v < w; v++) {
      x = arguments[v];
      if (Object.isArray(x) && !("callee" in x)) {
        for (var u = 0, y = x.length; u < y; u++) {
          z.push(x[u])
        }
      } else {
        z.push(x)
      }
    }
    return z
  }
  Object.extend(r, Enumerable);
  if (!r._reverse) {
    r._reverse = r.reverse
  }
  Object.extend(r, {
    _each: o,
    clear: l,
    first: d,
    last: g,
    compact: i,
    flatten: t,
    without: h,
    reverse: f,
    uniq: k,
    intersect: p,
    clone: q,
    toArray: q,
    size: j,
    inspect: s
  });
  var e = (function() {
    return [].concat(arguments)[0][0] !== 1
  })(1, 2);
  if (e) {
    r.concat = c
  }
  if (!r.indexOf) {
    r.indexOf = a
  }
  if (!r.lastIndexOf) {
    r.lastIndexOf = n
  }
})();

function $H(a) {
  return new Hash(a)
}
var Hash = Class.create(Enumerable, (function() {
  function e(p) {
    this._object = Object.isHash(p) ? p.toObject() : Object.clone(p)
  }

  function f(q) {
    for (var p in this._object) {
      var r = this._object[p],
        s = [p, r];
      s.key = p;
      s.value = r;
      q(s)
    }
  }

  function j(p, q) {
    return this._object[p] = q
  }

  function c(p) {
    if (this._object[p] !== Object.prototype[p]) {
      return this._object[p]
    }
  }

  function m(p) {
    var q = this._object[p];
    delete this._object[p];
    return q
  }

  function o() {
    return Object.clone(this._object)
  }

  function n() {
    return this.pluck("key")
  }

  function l() {
    return this.pluck("value")
  }

  function g(q) {
    var p = this.detect(function(r) {
      return r.value === q
    });
    return p && p.key
  }

  function i(p) {
    return this.clone().update(p)
  }

  function d(p) {
    return new Hash(p).inject(this, function(q, r) {
      q.set(r.key, r.value);
      return q
    })
  }

  function b(p, q) {
    if (Object.isUndefined(q)) {
      return p
    }
    return p + "=" + encodeURIComponent(String.interpret(q))
  }

  function a() {
    return this.inject([], function(t, w) {
      var s = encodeURIComponent(w.key),
        q = w.value;
      if (q && typeof q == "object") {
        if (Object.isArray(q)) {
          var v = [];
          for (var r = 0, p = q.length, u; r < p; r++) {
            u = q[r];
            v.push(b(s, u))
          }
          return t.concat(v)
        }
      } else {
        t.push(b(s, q))
      }
      return t
    }).join("&")
  }

  function k() {
    return "#<Hash:{" + this.map(function(p) {
      return p.map(Object.inspect).join(": ")
    }).join(", ") + "}>"
  }

  function h() {
    return new Hash(this)
  }
  return {
    initialize: e,
    _each: f,
    set: j,
    get: c,
    unset: m,
    toObject: o,
    toTemplateReplacements: o,
    keys: n,
    values: l,
    index: g,
    merge: i,
    update: d,
    toQueryString: a,
    inspect: k,
    toJSON: o,
    clone: h
  }
})());
Hash.from = $H;
Object.extend(Number.prototype, (function() {
  function d() {
    return this.toPaddedString(2, 16)
  }

  function b() {
    return this + 1
  }

  function h(j, i) {
    $R(0, this, true).each(j, i);
    return this
  }

  function g(k, j) {
    var i = this.toString(j || 10);
    return "0".times(k - i.length) + i
  }

  function a() {
    return Math.abs(this)
  }

  function c() {
    return Math.round(this)
  }

  function e() {
    return Math.ceil(this)
  }

  function f() {
    return Math.floor(this)
  }
  return {
    toColorPart: d,
    succ: b,
    times: h,
    toPaddedString: g,
    abs: a,
    round: c,
    ceil: e,
    floor: f
  }
})());

function $R(c, a, b) {
  return new ObjectRange(c, a, b)
}
var ObjectRange = Class.create(Enumerable, (function() {
  function b(f, d, e) {
    this.start = f;
    this.end = d;
    this.exclusive = e
  }

  function c(d) {
    var e = this.start;
    while (this.include(e)) {
      d(e);
      e = e.succ()
    }
  }

  function a(d) {
    if (d < this.start) {
      return false
    }
    if (this.exclusive) {
      return d < this.end
    }
    return d <= this.end
  }
  return {
    initialize: b,
    _each: c,
    include: a
  }
})());
var Ajax = {
  getTransport: function() {
    return Try.these(function() {
      return new XMLHttpRequest()
    }, function() {
      return new ActiveXObject("Msxml2.XMLHTTP")
    }, function() {
      return new ActiveXObject("Microsoft.XMLHTTP")
    }) || false
  },
  activeRequestCount: 0
};
Ajax.Responders = {
  responders: [],
  _each: function(a) {
    this.responders._each(a)
  },
  register: function(a) {
    if (!this.include(a)) {
      this.responders.push(a)
    }
  },
  unregister: function(a) {
    this.responders = this.responders.without(a)
  },
  dispatch: function(d, b, c, a) {
    this.each(function(f) {
      if (Object.isFunction(f[d])) {
        try {
          f[d].apply(f, [b, c, a])
        } catch (g) {}
      }
    })
  }
};
Object.extend(Ajax.Responders, Enumerable);
Ajax.Responders.register({
  onCreate: function() {
    Ajax.activeRequestCount++
  },
  onComplete: function() {
    Ajax.activeRequestCount--
  }
});
Ajax.Base = Class.create({
  initialize: function(a) {
    this.options = {
      method: "post",
      asynchronous: true,
      contentType: "application/x-www-form-urlencoded",
      encoding: "UTF-8",
      parameters: "",
      evalJSON: true,
      evalJS: true
    };
    Object.extend(this.options, a || {});
    this.options.method = this.options.method.toLowerCase();
    if (Object.isHash(this.options.parameters)) {
      this.options.parameters = this.options.parameters.toObject()
    }
  }
});
Ajax.Request = Class.create(Ajax.Base, {
  _complete: false,
  initialize: function($super, b, a) {
    $super(a);
    this.transport = Ajax.getTransport();
    this.request(b)
  },
  request: function(b) {
    this.url = b;
    this.method = this.options.method;
    var d = Object.isString(this.options.parameters) ? this.options.parameters : Object.toQueryString(this.options.parameters);
    if (!["get", "post"].include(this.method)) {
      d += (d ? "&" : "") + "_method=" + this.method;
      this.method = "post"
    }
    if (d && this.method === "get") {
      this.url += (this.url.include("?") ? "&" : "?") + d
    }
    this.parameters = d.toQueryParams();
    try {
      var a = new Ajax.Response(this);
      if (this.options.onCreate) {
        this.options.onCreate(a)
      }
      Ajax.Responders.dispatch("onCreate", this, a);
      this.transport.open(this.method.toUpperCase(), this.url, this.options.asynchronous);
      if (this.options.asynchronous) {
        this.respondToReadyState.bind(this).defer(1)
      }
      this.transport.onreadystatechange = this.onStateChange.bind(this);
      this.setRequestHeaders();
      this.body = this.method == "post" ? (this.options.postBody || d) : null;
      this.transport.send(this.body);
      if (!this.options.asynchronous && this.transport.overrideMimeType) {
        this.onStateChange()
      }
    } catch (c) {
      this.dispatchException(c)
    }
  },
  onStateChange: function() {
    var a = this.transport.readyState;
    if (a > 1 && !((a == 4) && this._complete)) {
      this.respondToReadyState(this.transport.readyState)
    }
  },
  setRequestHeaders: function() {
    var e = {
      "X-Requested-With": "XMLHttpRequest",
      "X-Prototype-Version": Prototype.Version,
      Accept: "text/javascript, text/html, application/xml, text/xml, */*"
    };
    if (this.method == "post") {
      e["Content-type"] = this.options.contentType + (this.options.encoding ? "; charset=" + this.options.encoding : "");
      if (this.transport.overrideMimeType && (navigator.userAgent.match(/Gecko\/(\d{4})/) || [0, 2005])[1] < 2005) {
        e.Connection = "close"
      }
    }
    if (typeof this.options.requestHeaders == "object") {
      var c = this.options.requestHeaders;
      if (Object.isFunction(c.push)) {
        for (var b = 0, d = c.length; b < d; b += 2) {
          e[c[b]] = c[b + 1]
        }
      } else {
        $H(c).each(function(f) {
          e[f.key] = f.value
        })
      }
    }
    for (var a in e) {
      this.transport.setRequestHeader(a, e[a])
    }
  },
  success: function() {
    var a = this.getStatus();
    return !a || (a >= 200 && a < 300) || a == 304
  },
  getStatus: function() {
    try {
      if (this.transport.status === 1223) {
        return 204
      }
      return this.transport.status || 0
    } catch (a) {
      return 0
    }
  },
  respondToReadyState: function(a) {
    var c = Ajax.Request.Events[a],
      b = new Ajax.Response(this);
    if (c == "Complete") {
      try {
        this._complete = true;
        (this.options["on" + b.status] || this.options["on" + (this.success() ? "Success" : "Failure")] || Prototype.emptyFunction)(b, b.headerJSON)
      } catch (d) {
        this.dispatchException(d)
      }
      var f = b.getHeader("Content-type");
      if (this.options.evalJS == "force" || (this.options.evalJS && this.isSameOrigin() && f && f.match(/^\s*(text|application)\/(x-)?(java|ecma)script(;.*)?\s*$/i))) {
        this.evalResponse()
      }
    }
    try {
      (this.options["on" + c] || Prototype.emptyFunction)(b, b.headerJSON);
      Ajax.Responders.dispatch("on" + c, this, b, b.headerJSON)
    } catch (d) {
      this.dispatchException(d)
    }
    if (c == "Complete") {
      this.transport.onreadystatechange = Prototype.emptyFunction
    }
  },
  isSameOrigin: function() {
    var a = this.url.match(/^\s*https?:\/\/[^\/]*/);
    return !a || (a[0] == "#{protocol}//#{domain}#{port}".interpolate({
      protocol: location.protocol,
      domain: document.domain,
      port: location.port ? ":" + location.port : ""
    }))
  },
  getHeader: function(a) {
    try {
      return this.transport.getResponseHeader(a) || null
    } catch (b) {
      return null
    }
  },
  evalResponse: function() {
    try {
      return eval((this.transport.responseText || "").unfilterJSON())
    } catch (e) {
      this.dispatchException(e)
    }
  },
  dispatchException: function(a) {
    (this.options.onException || Prototype.emptyFunction)(this, a);
    Ajax.Responders.dispatch("onException", this, a)
  }
});
Ajax.Request.Events = ["Uninitialized", "Loading", "Loaded", "Interactive", "Complete"];
Ajax.Response = Class.create({
  initialize: function(c) {
    this.request = c;
    var d = this.transport = c.transport,
      a = this.readyState = d.readyState;
    if ((a > 2 && !Prototype.Browser.IE) || a == 4) {
      this.status = this.getStatus();
      this.statusText = this.getStatusText();
      this.responseText = String.interpret(d.responseText);
      this.headerJSON = this._getHeaderJSON()
    }
    if (a == 4) {
      var b = d.responseXML;
      this.responseXML = Object.isUndefined(b) ? null : b;
      this.responseJSON = this._getResponseJSON()
    }
  },
  status: 0,
  statusText: "",
  getStatus: Ajax.Request.prototype.getStatus,
  getStatusText: function() {
    try {
      return this.transport.statusText || ""
    } catch (a) {
      return ""
    }
  },
  getHeader: Ajax.Request.prototype.getHeader,
  getAllHeaders: function() {
    try {
      return this.getAllResponseHeaders()
    } catch (a) {
      return null
    }
  },
  getResponseHeader: function(a) {
    return this.transport.getResponseHeader(a)
  },
  getAllResponseHeaders: function() {
    return this.transport.getAllResponseHeaders()
  },
  _getHeaderJSON: function() {
    var a = this.getHeader("X-JSON");
    if (!a) {
      return null
    }
    a = decodeURIComponent(escape(a));
    try {
      return a.evalJSON(this.request.options.sanitizeJSON || !this.request.isSameOrigin())
    } catch (b) {
      this.request.dispatchException(b)
    }
  },
  _getResponseJSON: function() {
    var a = this.request.options;
    if (!a.evalJSON || (a.evalJSON != "force" && !(this.getHeader("Content-type") || "").include("application/json")) || this.responseText.blank()) {
      return null
    }
    try {
      return this.responseText.evalJSON(a.sanitizeJSON || !this.request.isSameOrigin())
    } catch (b) {
      this.request.dispatchException(b)
    }
  }
});
Ajax.Updater = Class.create(Ajax.Request, {
  initialize: function($super, a, c, b) {
    this.container = {
      success: (a.success || a),
      failure: (a.failure || (a.success ? null : a))
    };
    b = Object.clone(b);
    var d = b.onComplete;
    b.onComplete = (function(e, f) {
      this.updateContent(e.responseText);
      if (Object.isFunction(d)) {
        d(e, f)
      }
    }).bind(this);
    $super(c, b)
  },
  updateContent: function(d) {
    var c = this.container[this.success() ? "success" : "failure"],
      a = this.options;
    if (!a.evalScripts) {
      d = d.stripScripts()
    }
    if (c = $(c)) {
      if (a.insertion) {
        if (Object.isString(a.insertion)) {
          var b = {};
          b[a.insertion] = d;
          c.insert(b)
        } else {
          a.insertion(c, d)
        }
      } else {
        c.update(d)
      }
    }
  }
});
Ajax.PeriodicalUpdater = Class.create(Ajax.Base, {
  initialize: function($super, a, c, b) {
    $super(b);
    this.onComplete = this.options.onComplete;
    this.frequency = (this.options.frequency || 2);
    this.decay = (this.options.decay || 1);
    this.updater = {};
    this.container = a;
    this.url = c;
    this.start()
  },
  start: function() {
    this.options.onComplete = this.updateComplete.bind(this);
    this.onTimerEvent()
  },
  stop: function() {
    this.updater.options.onComplete = undefined;
    clearTimeout(this.timer);
    (this.onComplete || Prototype.emptyFunction).apply(this, arguments)
  },
  updateComplete: function(a) {
    if (this.options.decay) {
      this.decay = (a.responseText == this.lastText ? this.decay * this.options.decay : 1);
      this.lastText = a.responseText
    }
    this.timer = this.onTimerEvent.bind(this).delay(this.decay * this.frequency)
  },
  onTimerEvent: function() {
    this.updater = new Ajax.Updater(this.container, this.url, this.options)
  }
});

function $(b) {
  if (arguments.length > 1) {
    for (var a = 0, d = [], c = arguments.length; a < c; a++) {
      d.push($(arguments[a]))
    }
    return d
  }
  if (Object.isString(b)) {
    b = document.getElementById(b)
  }
  return Element.extend(b)
}
if (Prototype.BrowserFeatures.XPath) {
  document._getElementsByXPath = function(f, a) {
    var c = [];
    var e = document.evaluate(f, $(a) || document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    for (var b = 0, d = e.snapshotLength; b < d; b++) {
      c.push(Element.extend(e.snapshotItem(b)))
    }
    return c
  }
}
if (!Node) {
  var Node = {}
}
if (!Node.ELEMENT_NODE) {
  Object.extend(Node, {
    ELEMENT_NODE: 1,
    ATTRIBUTE_NODE: 2,
    TEXT_NODE: 3,
    CDATA_SECTION_NODE: 4,
    ENTITY_REFERENCE_NODE: 5,
    ENTITY_NODE: 6,
    PROCESSING_INSTRUCTION_NODE: 7,
    COMMENT_NODE: 8,
    DOCUMENT_NODE: 9,
    DOCUMENT_TYPE_NODE: 10,
    DOCUMENT_FRAGMENT_NODE: 11,
    NOTATION_NODE: 12
  })
}(function(c) {
  function d(f, e) {
    if (f === "select") {
      return false
    }
    if ("type" in e) {
      return false
    }
    return true
  }
  var b = (function() {
    try {
      var e = document.createElement('<input name="x">');
      return e.tagName.toLowerCase() === "input" && e.name === "x"
    } catch (f) {
      return false
    }
  })();
  var a = c.Element;
  c.Element = function(g, f) {
    f = f || {};
    g = g.toLowerCase();
    var e = Element.cache;
    if (b && f.name) {
      g = "<" + g + ' name="' + f.name + '">';
      delete f.name;
      return Element.writeAttribute(document.createElement(g), f)
    }
    if (!e[g]) {
      e[g] = Element.extend(document.createElement(g))
    }
    var h = d(g, f) ? e[g].cloneNode(false) : document.createElement(g);
    return Element.writeAttribute(h, f)
  };
  Object.extend(c.Element, a || {});
  if (a) {
    c.Element.prototype = a.prototype
  }
})(this);
Element.idCounter = 1;
Element.cache = {};
Element._purgeElement = function(b) {
  var a = b._prototypeUID;
  if (a) {
    Element.stopObserving(b);
    b._prototypeUID = void 0;
    delete Element.Storage[a]
  }
};
Element.Methods = {
  visible: function(a) {
    return $(a).style.display != "none"
  },
  toggle: function(a) {
    a = $(a);
    Element[Element.visible(a) ? "hide" : "show"](a);
    return a
  },
  hide: function(a) {
    a = $(a);
    a.style.display = "none";
    return a
  },
  show: function(a) {
    a = $(a);
    a.style.display = "";
    return a
  },
  remove: function(a) {
    a = $(a);
    a.parentNode.removeChild(a);
    return a
  },
  update: (function() {
    var d = (function() {
      var g = document.createElement("select"),
        h = true;
      g.innerHTML = '<option value="test">test</option>';
      if (g.options && g.options[0]) {
        h = g.options[0].nodeName.toUpperCase() !== "OPTION"
      }
      g = null;
      return h
    })();
    var b = (function() {
      try {
        var g = document.createElement("table");
        if (g && g.tBodies) {
          g.innerHTML = "<tbody><tr><td>test</td></tr></tbody>";
          var i = typeof g.tBodies[0] == "undefined";
          g = null;
          return i
        }
      } catch (h) {
        return true
      }
    })();
    var a = (function() {
      try {
        var g = document.createElement("div");
        g.innerHTML = "<link>";
        var i = (g.childNodes.length === 0);
        g = null;
        return i
      } catch (h) {
        return true
      }
    })();
    var c = d || b || a;
    var f = (function() {
      var g = document.createElement("script"),
        i = false;
      try {
        g.appendChild(document.createTextNode(""));
        i = !g.firstChild || g.firstChild && g.firstChild.nodeType !== 3
      } catch (h) {
        i = true
      }
      g = null;
      return i
    })();

    function e(l, m) {
      l = $(l);
      var g = Element._purgeElement;
      var n = l.getElementsByTagName("*"),
        k = n.length;
      while (k--) {
        g(n[k])
      }
      if (m && m.toElement) {
        m = m.toElement()
      }
      if (Object.isElement(m)) {
        return l.update().insert(m)
      }
      m = Object.toHTML(m);
      var j = l.tagName.toUpperCase();
      if (j === "SCRIPT" && f) {
        l.text = m;
        return l
      }
      if (c) {
        if (j in Element._insertionTranslations.tags) {
          while (l.firstChild) {
            l.removeChild(l.firstChild)
          }
          Element._getContentFromAnonymousElement(j, m.stripScripts()).each(function(i) {
            l.appendChild(i)
          })
        } else {
          if (a && Object.isString(m) && m.indexOf("<link") > -1) {
            while (l.firstChild) {
              l.removeChild(l.firstChild)
            }
            var h = Element._getContentFromAnonymousElement(j, m.stripScripts(), true);
            h.each(function(i) {
              l.appendChild(i)
            })
          } else {
            l.innerHTML = m.stripScripts()
          }
        }
      } else {
        l.innerHTML = m.stripScripts()
      }
      m.evalScripts.bind(m).defer();
      return l
    }
    return e
  })(),
  replace: function(b, c) {
    b = $(b);
    if (c && c.toElement) {
      c = c.toElement()
    } else {
      if (!Object.isElement(c)) {
        c = Object.toHTML(c);
        var a = b.ownerDocument.createRange();
        a.selectNode(b);
        c.evalScripts.bind(c).defer();
        c = a.createContextualFragment(c.stripScripts())
      }
    }
    b.parentNode.replaceChild(c, b);
    return b
  },
  insert: function(c, e) {
    c = $(c);
    if (Object.isString(e) || Object.isNumber(e) || Object.isElement(e) || (e && (e.toElement || e.toHTML))) {
      e = {
        bottom: e
      }
    }
    var d, f, b, g;
    for (var a in e) {
      d = e[a];
      a = a.toLowerCase();
      f = Element._insertionTranslations[a];
      if (d && d.toElement) {
        d = d.toElement()
      }
      if (Object.isElement(d)) {
        f(c, d);
        continue
      }
      d = Object.toHTML(d);
      b = ((a == "before" || a == "after") ? c.parentNode : c).tagName.toUpperCase();
      g = Element._getContentFromAnonymousElement(b, d.stripScripts());
      if (a == "top" || a == "after") {
        g.reverse()
      }
      g.each(f.curry(c));
      d.evalScripts.bind(d).defer()
    }
    return c
  },
  wrap: function(b, c, a) {
    b = $(b);
    if (Object.isElement(c)) {
      $(c).writeAttribute(a || {})
    } else {
      if (Object.isString(c)) {
        c = new Element(c, a)
      } else {
        c = new Element("div", c)
      }
    }
    if (b.parentNode) {
      b.parentNode.replaceChild(c, b)
    }
    c.appendChild(b);
    return c
  },
  inspect: function(b) {
    b = $(b);
    var a = "<" + b.tagName.toLowerCase();
    $H({
      id: "id",
      className: "class"
    }).each(function(f) {
      var e = f.first(),
        c = f.last(),
        d = (b[e] || "").toString();
      if (d) {
        a += " " + c + "=" + d.inspect(true)
      }
    });
    return a + ">"
  },
  recursivelyCollect: function(a, c, d) {
    a = $(a);
    d = d || -1;
    var b = [];
    while (a = a[c]) {
      if (a.nodeType == 1) {
        b.push(Element.extend(a))
      }
      if (b.length == d) {
        break
      }
    }
    return b
  },
  ancestors: function(a) {
    return Element.recursivelyCollect(a, "parentNode")
  },
  descendants: function(a) {
    return Element.select(a, "*")
  },
  firstDescendant: function(a) {
    a = $(a).firstChild;
    while (a && a.nodeType != 1) {
      a = a.nextSibling
    }
    return $(a)
  },
  immediateDescendants: function(b) {
    var a = [],
      c = $(b).firstChild;
    while (c) {
      if (c.nodeType === 1) {
        a.push(Element.extend(c))
      }
      c = c.nextSibling
    }
    return a
  },
  previousSiblings: function(a, b) {
    return Element.recursivelyCollect(a, "previousSibling")
  },
  nextSiblings: function(a) {
    return Element.recursivelyCollect(a, "nextSibling")
  },
  siblings: function(a) {
    a = $(a);
    return Element.previousSiblings(a).reverse().concat(Element.nextSiblings(a))
  },
  match: function(b, a) {
    b = $(b);
    if (Object.isString(a)) {
      return Prototype.Selector.match(b, a)
    }
    return a.match(b)
  },
  up: function(b, d, a) {
    b = $(b);
    if (arguments.length == 1) {
      return $(b.parentNode)
    }
    var c = Element.ancestors(b);
    return Object.isNumber(d) ? c[d] : Prototype.Selector.find(c, d, a)
  },
  down: function(b, c, a) {
    b = $(b);
    if (arguments.length == 1) {
      return Element.firstDescendant(b)
    }
    return Object.isNumber(c) ? Element.descendants(b)[c] : Element.select(b, c)[a || 0]
  },
  previous: function(b, c, a) {
    b = $(b);
    if (Object.isNumber(c)) {
      a = c, c = false
    }
    if (!Object.isNumber(a)) {
      a = 0
    }
    if (c) {
      return Prototype.Selector.find(b.previousSiblings(), c, a)
    } else {
      return b.recursivelyCollect("previousSibling", a + 1)[a]
    }
  },
  next: function(b, d, a) {
    b = $(b);
    if (Object.isNumber(d)) {
      a = d, d = false
    }
    if (!Object.isNumber(a)) {
      a = 0
    }
    if (d) {
      return Prototype.Selector.find(b.nextSiblings(), d, a)
    } else {
      var c = Object.isNumber(a) ? a + 1 : 1;
      return b.recursivelyCollect("nextSibling", a + 1)[a]
    }
  },
  select: function(a) {
    a = $(a);
    var b = Array.prototype.slice.call(arguments, 1).join(", ");
    return Prototype.Selector.select(b, a)
  },
  adjacent: function(a) {
    a = $(a);
    var b = Array.prototype.slice.call(arguments, 1).join(", ");
    return Prototype.Selector.select(b, a.parentNode).without(a)
  },
  identify: function(a) {
    a = $(a);
    var b = Element.readAttribute(a, "id");
    if (b) {
      return b
    }
    do {
      b = "anonymous_element_" + Element.idCounter++
    } while ($(b));
    Element.writeAttribute(a, "id", b);
    return b
  },
  readAttribute: function(c, a) {
    c = $(c);
    if (Prototype.Browser.IE) {
      var b = Element._attributeTranslations.read;
      if (b.values[a]) {
        return b.values[a](c, a)
      }
      if (b.names[a]) {
        a = b.names[a]
      }
      if (a.include(":")) {
        return (!c.attributes || !c.attributes[a]) ? null : c.attributes[a].value
      }
    }
    return c.getAttribute(a)
  },
  writeAttribute: function(e, c, f) {
    e = $(e);
    var b = {},
      d = Element._attributeTranslations.write;
    if (typeof c == "object") {
      b = c
    } else {
      b[c] = Object.isUndefined(f) ? true : f
    }
    for (var a in b) {
      c = d.names[a] || a;
      f = b[a];
      if (d.values[a]) {
        c = d.values[a](e, f)
      }
      if (f === false || f === null) {
        e.removeAttribute(c)
      } else {
        if (f === true) {
          e.setAttribute(c, c)
        } else {
          e.setAttribute(c, f)
        }
      }
    }
    return e
  },
  getHeight: function(a) {
    return Element.getDimensions(a).height
  },
  getWidth: function(a) {
    return Element.getDimensions(a).width
  },
  classNames: function(a) {
    return new Element.ClassNames(a)
  },
  hasClassName: function(a, b) {
    if (!(a = $(a))) {
      return
    }
    var c = a.className;
    return (c.length > 0 && (c == b || new RegExp("(^|\\s)" + b + "(\\s|$)").test(c)))
  },
  addClassName: function(a, b) {
    if (!(a = $(a))) {
      return
    }
    if (!Element.hasClassName(a, b)) {
      a.className += (a.className ? " " : "") + b
    }
    return a
  },
  removeClassName: function(a, b) {
    if (!(a = $(a))) {
      return
    }
    a.className = a.className.replace(new RegExp("(^|\\s+)" + b + "(\\s+|$)"), " ").strip();
    return a
  },
  toggleClassName: function(a, b) {
    if (!(a = $(a))) {
      return
    }
    return Element[Element.hasClassName(a, b) ? "removeClassName" : "addClassName"](a, b)
  },
  cleanWhitespace: function(b) {
    b = $(b);
    var c = b.firstChild;
    while (c) {
      var a = c.nextSibling;
      if (c.nodeType == 3 && !/\S/.test(c.nodeValue)) {
        b.removeChild(c)
      }
      c = a
    }
    return b
  },
  empty: function(a) {
    return $(a).innerHTML.blank()
  },
  descendantOf: function(b, a) {
    b = $(b), a = $(a);
    if (b.compareDocumentPosition) {
      return (b.compareDocumentPosition(a) & 8) === 8
    }
    if (a.contains) {
      return a.contains(b) && a !== b
    }
    while (b = b.parentNode) {
      if (b == a) {
        return true
      }
    }
    return false
  },
  scrollTo: function(a) {
    a = $(a);
    var b = Element.cumulativeOffset(a);
    window.scrollTo(b[0], b[1]);
    return a
  },
  getStyle: function(b, c) {
    b = $(b);
    c = c == "float" ? "cssFloat" : c.camelize();
    var d = b.style[c];
    if (!d || d == "auto") {
      var a = document.defaultView.getComputedStyle(b, null);
      d = a ? a[c] : null
    }
    if (c == "opacity") {
      return d ? parseFloat(d) : 1
    }
    return d == "auto" ? null : d
  },
  getOpacity: function(a) {
    return $(a).getStyle("opacity")
  },
  setStyle: function(b, c) {
    b = $(b);
    var e = b.style,
      a;
    if (Object.isString(c)) {
      b.style.cssText += ";" + c;
      return c.include("opacity") ? b.setOpacity(c.match(/opacity:\s*(\d?\.?\d*)/)[1]) : b
    }
    for (var d in c) {
      if (d == "opacity") {
        b.setOpacity(c[d])
      } else {
        e[(d == "float" || d == "cssFloat") ? (Object.isUndefined(e.styleFloat) ? "cssFloat" : "styleFloat") : d] = c[d]
      }
    }
    return b
  },
  setOpacity: function(a, b) {
    a = $(a);
    a.style.opacity = (b == 1 || b === "") ? "" : (b < 0.00001) ? 0 : b;
    return a
  },
  makePositioned: function(a) {
    a = $(a);
    var b = Element.getStyle(a, "position");
    if (b == "static" || !b) {
      a._madePositioned = true;
      a.style.position = "relative";
      if (Prototype.Browser.Opera) {
        a.style.top = 0;
        a.style.left = 0
      }
    }
    return a
  },
  undoPositioned: function(a) {
    a = $(a);
    if (a._madePositioned) {
      a._madePositioned = undefined;
      a.style.position = a.style.top = a.style.left = a.style.bottom = a.style.right = ""
    }
    return a
  },
  makeClipping: function(a) {
    a = $(a);
    if (a._overflow) {
      return a
    }
    a._overflow = Element.getStyle(a, "overflow") || "auto";
    if (a._overflow !== "hidden") {
      a.style.overflow = "hidden"
    }
    return a
  },
  undoClipping: function(a) {
    a = $(a);
    if (!a._overflow) {
      return a
    }
    a.style.overflow = a._overflow == "auto" ? "" : a._overflow;
    a._overflow = null;
    return a
  },
  clonePosition: function(b, d) {
    var a = Object.extend({
      setLeft: true,
      setTop: true,
      setWidth: true,
      setHeight: true,
      offsetTop: 0,
      offsetLeft: 0
    }, arguments[2] || {});
    d = $(d);
    var e = Element.viewportOffset(d),
      f = [0, 0],
      c = null;
    b = $(b);
    if (Element.getStyle(b, "position") == "absolute") {
      c = Element.getOffsetParent(b);
      f = Element.viewportOffset(c)
    }
    if (c == document.body) {
      f[0] -= document.body.offsetLeft;
      f[1] -= document.body.offsetTop
    }
    if (a.setLeft) {
      b.style.left = (e[0] - f[0] + a.offsetLeft) + "px"
    }
    if (a.setTop) {
      b.style.top = (e[1] - f[1] + a.offsetTop) + "px"
    }
    if (a.setWidth) {
      b.style.width = d.offsetWidth + "px"
    }
    if (a.setHeight) {
      b.style.height = d.offsetHeight + "px"
    }
    return b
  }
};
Object.extend(Element.Methods, {
  getElementsBySelector: Element.Methods.select,
  childElements: Element.Methods.immediateDescendants
});
Element._attributeTranslations = {
  write: {
    names: {
      className: "class",
      htmlFor: "for"
    },
    values: {}
  }
};
if (Prototype.Browser.Opera) {
  Element.Methods.getStyle = Element.Methods.getStyle.wrap(function(d, b, c) {
    switch (c) {
      case "height":
      case "width":
        if (!Element.visible(b)) {
          return null
        }
        var e = parseInt(d(b, c), 10);
        if (e !== b["offset" + c.capitalize()]) {
          return e + "px"
        }
        var a;
        if (c === "height") {
          a = ["border-top-width", "padding-top", "padding-bottom", "border-bottom-width"]
        } else {
          a = ["border-left-width", "padding-left", "padding-right", "border-right-width"]
        }
        return a.inject(e, function(f, g) {
          var h = d(b, g);
          return h === null ? f : f - parseInt(h, 10)
        }) + "px";
      default:
        return d(b, c)
    }
  });
  Element.Methods.readAttribute = Element.Methods.readAttribute.wrap(function(c, a, b) {
    if (b === "title") {
      return a.title
    }
    return c(a, b)
  })
} else {
  if (Prototype.Browser.IE) {
    Element.Methods.getStyle = function(a, b) {
      a = $(a);
      b = (b == "float" || b == "cssFloat") ? "styleFloat" : b.camelize();
      var c = a.style[b];
      if (!c && a.currentStyle) {
        c = a.currentStyle[b]
      }
      if (b == "opacity") {
        if (c = (a.getStyle("filter") || "").match(/alpha\(opacity=(.*)\)/)) {
          if (c[1]) {
            return parseFloat(c[1]) / 100
          }
        }
        return 1
      }
      if (c == "auto") {
        if ((b == "width" || b == "height") && (a.getStyle("display") != "none")) {
          return a["offset" + b.capitalize()] + "px"
        }
        return null
      }
      return c
    };
    Element.Methods.setOpacity = function(b, e) {
      function f(g) {
        return g.replace(/alpha\([^\)]*\)/gi, "")
      }
      b = $(b);
      var a = b.currentStyle;
      if ((a && !a.hasLayout) || (!a && b.style.zoom == "normal")) {
        b.style.zoom = 1
      }
      var d = b.getStyle("filter"),
        c = b.style;
      if (e == 1 || e === "") {
        (d = f(d)) ? c.filter = d: c.removeAttribute("filter");
        return b
      } else {
        if (e < 0.00001) {
          e = 0
        }
      }
      c.filter = f(d) + "alpha(opacity=" + (e * 100) + ")";
      return b
    };
    Element._attributeTranslations = (function() {
      var b = "className",
        a = "for",
        c = document.createElement("div");
      c.setAttribute(b, "x");
      if (c.className !== "x") {
        c.setAttribute("class", "x");
        if (c.className === "x") {
          b = "class"
        }
      }
      c = null;
      c = document.createElement("label");
      c.setAttribute(a, "x");
      if (c.htmlFor !== "x") {
        c.setAttribute("htmlFor", "x");
        if (c.htmlFor === "x") {
          a = "htmlFor"
        }
      }
      c = null;
      return {
        read: {
          names: {
            "class": b,
            className: b,
            "for": a,
            htmlFor: a
          },
          values: {
            _getAttr: function(d, e) {
              return d.getAttribute(e)
            },
            _getAttr2: function(d, e) {
              return d.getAttribute(e, 2)
            },
            _getAttrNode: function(d, f) {
              var e = d.getAttributeNode(f);
              return e ? e.value : ""
            },
            _getEv: (function() {
              var d = document.createElement("div"),
                g;
              d.onclick = Prototype.emptyFunction;
              var e = d.getAttribute("onclick");
              if (String(e).indexOf("{") > -1) {
                g = function(f, h) {
                  h = f.getAttribute(h);
                  if (!h) {
                    return null
                  }
                  h = h.toString();
                  h = h.split("{")[1];
                  h = h.split("}")[0];
                  return h.strip()
                }
              } else {
                if (e === "") {
                  g = function(f, h) {
                    h = f.getAttribute(h);
                    if (!h) {
                      return null
                    }
                    return h.strip()
                  }
                }
              }
              d = null;
              return g
            })(),
            _flag: function(d, e) {
              return $(d).hasAttribute(e) ? e : null
            },
            style: function(d) {
              return d.style.cssText.toLowerCase()
            },
            title: function(d) {
              return d.title
            }
          }
        }
      }
    })();
    Element._attributeTranslations.write = {
      names: Object.extend({
        cellpadding: "cellPadding",
        cellspacing: "cellSpacing"
      }, Element._attributeTranslations.read.names),
      values: {
        checked: function(a, b) {
          a.checked = !!b
        },
        style: function(a, b) {
          a.style.cssText = b ? b : ""
        }
      }
    };
    Element._attributeTranslations.has = {};
    $w("colSpan rowSpan vAlign dateTime accessKey tabIndex encType maxLength readOnly longDesc frameBorder").each(function(a) {
      Element._attributeTranslations.write.names[a.toLowerCase()] = a;
      Element._attributeTranslations.has[a.toLowerCase()] = a
    });
    (function(a) {
      Object.extend(a, {
        href: a._getAttr2,
        src: a._getAttr2,
        type: a._getAttr,
        action: a._getAttrNode,
        disabled: a._flag,
        checked: a._flag,
        readonly: a._flag,
        multiple: a._flag,
        onload: a._getEv,
        onunload: a._getEv,
        onclick: a._getEv,
        ondblclick: a._getEv,
        onmousedown: a._getEv,
        onmouseup: a._getEv,
        onmouseover: a._getEv,
        onmousemove: a._getEv,
        onmouseout: a._getEv,
        onfocus: a._getEv,
        onblur: a._getEv,
        onkeypress: a._getEv,
        onkeydown: a._getEv,
        onkeyup: a._getEv,
        onsubmit: a._getEv,
        onreset: a._getEv,
        onselect: a._getEv,
        onchange: a._getEv
      })
    })(Element._attributeTranslations.read.values);
    if (Prototype.BrowserFeatures.ElementExtensions) {
      (function() {
        function a(e) {
          var b = e.getElementsByTagName("*"),
            d = [];
          for (var c = 0, f; f = b[c]; c++) {
            if (f.tagName !== "!") {
              d.push(f)
            }
          }
          return d
        }
        Element.Methods.down = function(c, d, b) {
          c = $(c);
          if (arguments.length == 1) {
            return c.firstDescendant()
          }
          return Object.isNumber(d) ? a(c)[d] : Element.select(c, d)[b || 0]
        }
      })()
    }
  } else {
    if (Prototype.Browser.Gecko && /rv:1\.8\.0/.test(navigator.userAgent)) {
      Element.Methods.setOpacity = function(a, b) {
        a = $(a);
        a.style.opacity = (b == 1) ? 0.999999 : (b === "") ? "" : (b < 0.00001) ? 0 : b;
        return a
      }
    } else {
      if (Prototype.Browser.WebKit) {
        Element.Methods.setOpacity = function(a, b) {
          a = $(a);
          a.style.opacity = (b == 1 || b === "") ? "" : (b < 0.00001) ? 0 : b;
          if (b == 1) {
            if (a.tagName.toUpperCase() == "IMG" && a.width) {
              a.width++;
              a.width--
            } else {
              try {
                var d = document.createTextNode(" ");
                a.appendChild(d);
                a.removeChild(d)
              } catch (c) {}
            }
          }
          return a
        }
      }
    }
  }
}
if ("outerHTML" in document.documentElement) {
  Element.Methods.replace = function(c, e) {
    c = $(c);
    if (e && e.toElement) {
      e = e.toElement()
    }
    if (Object.isElement(e)) {
      c.parentNode.replaceChild(e, c);
      return c
    }
    e = Object.toHTML(e);
    var d = c.parentNode,
      b = d.tagName.toUpperCase();
    if (Element._insertionTranslations.tags[b]) {
      var f = c.next(),
        a = Element._getContentFromAnonymousElement(b, e.stripScripts());
      d.removeChild(c);
      if (f) {
        a.each(function(g) {
          d.insertBefore(g, f)
        })
      } else {
        a.each(function(g) {
          d.appendChild(g)
        })
      }
    } else {
      c.outerHTML = e.stripScripts()
    }
    e.evalScripts.bind(e).defer();
    return c
  }
}
Element._returnOffset = function(b, c) {
  var a = [b, c];
  a.left = b;
  a.top = c;
  return a
};
Element._getContentFromAnonymousElement = function(e, d, f) {
  var g = new Element("div"),
    c = Element._insertionTranslations.tags[e];
  var a = false;
  if (c) {
    a = true
  } else {
    if (f) {
      a = true;
      c = ["", "", 0]
    }
  }
  if (a) {
    g.innerHTML = "&nbsp;" + c[0] + d + c[1];
    g.removeChild(g.firstChild);
    for (var b = c[2]; b--;) {
      g = g.firstChild
    }
  } else {
    g.innerHTML = d
  }
  return $A(g.childNodes)
};
Element._insertionTranslations = {
  before: function(a, b) {
    a.parentNode.insertBefore(b, a)
  },
  top: function(a, b) {
    a.insertBefore(b, a.firstChild)
  },
  bottom: function(a, b) {
    a.appendChild(b)
  },
  after: function(a, b) {
    a.parentNode.insertBefore(b, a.nextSibling)
  },
  tags: {
    TABLE: ["<table>", "</table>", 1],
    TBODY: ["<table><tbody>", "</tbody></table>", 2],
    TR: ["<table><tbody><tr>", "</tr></tbody></table>", 3],
    TD: ["<table><tbody><tr><td>", "</td></tr></tbody></table>", 4],
    SELECT: ["<select>", "</select>", 1]
  }
};
(function() {
  var a = Element._insertionTranslations.tags;
  Object.extend(a, {
    THEAD: a.TBODY,
    TFOOT: a.TBODY,
    TH: a.TD
  })
})();
Element.Methods.Simulated = {
  hasAttribute: function(a, c) {
    c = Element._attributeTranslations.has[c] || c;
    var b = $(a).getAttributeNode(c);
    return !!(b && b.specified)
  }
};
Element.Methods.ByTag = {};
Object.extend(Element, Element.Methods);
(function(a) {
  if (!Prototype.BrowserFeatures.ElementExtensions && a.__proto__) {
    window.HTMLElement = {};
    window.HTMLElement.prototype = a.__proto__;
    Prototype.BrowserFeatures.ElementExtensions = true
  }
  a = null
})(document.createElement("div"));
Element.extend = (function() {
  function c(g) {
    if (typeof window.Element != "undefined") {
      var i = window.Element.prototype;
      if (i) {
        var k = "_" + (Math.random() + "").slice(2),
          h = document.createElement(g);
        i[k] = "x";
        var j = (h[k] !== "x");
        delete i[k];
        h = null;
        return j
      }
    }
    return false
  }

  function b(h, g) {
    for (var j in g) {
      var i = g[j];
      if (Object.isFunction(i) && !(j in h)) {
        h[j] = i.methodize()
      }
    }
  }
  var d = c("object");
  if (Prototype.BrowserFeatures.SpecificElementExtensions) {
    if (d) {
      return function(h) {
        if (h && typeof h._extendedByPrototype == "undefined") {
          var g = h.tagName;
          if (g && (/^(?:object|applet|embed)$/i.test(g))) {
            b(h, Element.Methods);
            b(h, Element.Methods.Simulated);
            b(h, Element.Methods.ByTag[g.toUpperCase()])
          }
        }
        return h
      }
    }
    return Prototype.K
  }
  var a = {},
    e = Element.Methods.ByTag;
  var f = Object.extend(function(i) {
    if (!i || typeof i._extendedByPrototype != "undefined" || i.nodeType != 1 || i == window) {
      return i
    }
    var g = Object.clone(a),
      h = i.tagName.toUpperCase();
    if (e[h]) {
      Object.extend(g, e[h])
    }
    b(i, g);
    i._extendedByPrototype = Prototype.emptyFunction;
    return i
  }, {
    refresh: function() {
      if (!Prototype.BrowserFeatures.ElementExtensions) {
        Object.extend(a, Element.Methods);
        Object.extend(a, Element.Methods.Simulated)
      }
    }
  });
  f.refresh();
  return f
})();
if (document.documentElement.hasAttribute) {
  Element.hasAttribute = function(a, b) {
    return a.hasAttribute(b)
  }
} else {
  Element.hasAttribute = Element.Methods.Simulated.hasAttribute
}
Element.addMethods = function(c) {
  var i = Prototype.BrowserFeatures,
    d = Element.Methods.ByTag;
  if (!c) {
    Object.extend(Form, Form.Methods);
    Object.extend(Form.Element, Form.Element.Methods);
    Object.extend(Element.Methods.ByTag, {
      FORM: Object.clone(Form.Methods),
      INPUT: Object.clone(Form.Element.Methods),
      SELECT: Object.clone(Form.Element.Methods),
      TEXTAREA: Object.clone(Form.Element.Methods),
      BUTTON: Object.clone(Form.Element.Methods)
    })
  }
  if (arguments.length == 2) {
    var b = c;
    c = arguments[1]
  }
  if (!b) {
    Object.extend(Element.Methods, c || {})
  } else {
    if (Object.isArray(b)) {
      b.each(g)
    } else {
      g(b)
    }
  }

  function g(k) {
    k = k.toUpperCase();
    if (!Element.Methods.ByTag[k]) {
      Element.Methods.ByTag[k] = {}
    }
    Object.extend(Element.Methods.ByTag[k], c)
  }

  function a(m, l, k) {
    k = k || false;
    for (var o in m) {
      var n = m[o];
      if (!Object.isFunction(n)) {
        continue
      }
      if (!k || !(o in l)) {
        l[o] = n.methodize()
      }
    }
  }

  function e(n) {
    var k;
    var m = {
      OPTGROUP: "OptGroup",
      TEXTAREA: "TextArea",
      P: "Paragraph",
      FIELDSET: "FieldSet",
      UL: "UList",
      OL: "OList",
      DL: "DList",
      DIR: "Directory",
      H1: "Heading",
      H2: "Heading",
      H3: "Heading",
      H4: "Heading",
      H5: "Heading",
      H6: "Heading",
      Q: "Quote",
      INS: "Mod",
      DEL: "Mod",
      A: "Anchor",
      IMG: "Image",
      CAPTION: "TableCaption",
      COL: "TableCol",
      COLGROUP: "TableCol",
      THEAD: "TableSection",
      TFOOT: "TableSection",
      TBODY: "TableSection",
      TR: "TableRow",
      TH: "TableCell",
      TD: "TableCell",
      FRAMESET: "FrameSet",
      IFRAME: "IFrame"
    };
    if (m[n]) {
      k = "HTML" + m[n] + "Element"
    }
    if (window[k]) {
      return window[k]
    }
    k = "HTML" + n + "Element";
    if (window[k]) {
      return window[k]
    }
    k = "HTML" + n.capitalize() + "Element";
    if (window[k]) {
      return window[k]
    }
    var l = document.createElement(n),
      o = l.__proto__ || l.constructor.prototype;
    l = null;
    return o
  }
  var h = window.HTMLElement ? HTMLElement.prototype : Element.prototype;
  if (i.ElementExtensions) {
    a(Element.Methods, h);
    a(Element.Methods.Simulated, h, true)
  }
  if (i.SpecificElementExtensions) {
    for (var j in Element.Methods.ByTag) {
      var f = e(j);
      if (Object.isUndefined(f)) {
        continue
      }
      a(d[j], f.prototype)
    }
  }
  Object.extend(Element, Element.Methods);
  delete Element.ByTag;
  if (Element.extend.refresh) {
    Element.extend.refresh()
  }
  Element.cache = {}
};
document.viewport = {
  getDimensions: function() {
    return {
      width: this.getWidth(),
      height: this.getHeight()
    }
  },
  getScrollOffsets: function() {
    return Element._returnOffset(window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft, window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop)
  }
};
(function(b) {
  var g = Prototype.Browser,
    e = document,
    c, d = {};

  function a() {
    if (g.WebKit && !e.evaluate) {
      return document
    }
    if (g.Opera && window.parseFloat(window.opera.version()) < 9.5) {
      return document.body
    }
    return document.documentElement
  }

  function f(h) {
    if (!c) {
      c = a()
    }
    d[h] = "client" + h;
    b["get" + h] = function() {
      return c[d[h]]
    };
    return b["get" + h]()
  }
  b.getWidth = f.curry("Width");
  b.getHeight = f.curry("Height")
})(document.viewport);
Element.Storage = {
  UID: 1
};
Element.addMethods({
  getStorage: function(b) {
    if (!(b = $(b))) {
      return
    }
    var a;
    if (b === window) {
      a = 0
    } else {
      if (typeof b._prototypeUID === "undefined") {
        b._prototypeUID = Element.Storage.UID++
      }
      a = b._prototypeUID
    }
    if (!Element.Storage[a]) {
      Element.Storage[a] = $H()
    }
    return Element.Storage[a]
  },
  store: function(b, a, c) {
    if (!(b = $(b))) {
      return
    }
    if (arguments.length === 2) {
      Element.getStorage(b).update(a)
    } else {
      Element.getStorage(b).set(a, c)
    }
    return b
  },
  retrieve: function(c, b, a) {
    if (!(c = $(c))) {
      return
    }
    var e = Element.getStorage(c),
      d = e.get(b);
    if (Object.isUndefined(d)) {
      e.set(b, a);
      d = a
    }
    return d
  },
  clone: function(c, a) {
    if (!(c = $(c))) {
      return
    }
    var e = c.cloneNode(a);
    e._prototypeUID = void 0;
    if (a) {
      var d = Element.select(e, "*"),
        b = d.length;
      while (b--) {
        d[b]._prototypeUID = void 0
      }
    }
    return Element.extend(e)
  },
  purge: function(c) {
    if (!(c = $(c))) {
      return
    }
    var a = Element._purgeElement;
    a(c);
    var d = c.getElementsByTagName("*"),
      b = d.length;
    while (b--) {
      a(d[b])
    }
    return null
  }
});
(function() {
  function h(v) {
    var u = v.match(/^(\d+)%?$/i);
    if (!u) {
      return null
    }
    return (Number(u[1]) / 100)
  }

  function o(F, G, v) {
    var y = null;
    if (Object.isElement(F)) {
      y = F;
      F = y.getStyle(G)
    }
    if (F === null) {
      return null
    }
    if ((/^(?:-)?\d+(\.\d+)?(px)?$/i).test(F)) {
      return window.parseFloat(F)
    }
    var A = F.include("%"),
      w = (v === document.viewport);
    if (/\d/.test(F) && y && y.runtimeStyle && !(A && w)) {
      var u = y.style.left,
        E = y.runtimeStyle.left;
      y.runtimeStyle.left = y.currentStyle.left;
      y.style.left = F || 0;
      F = y.style.pixelLeft;
      y.style.left = u;
      y.runtimeStyle.left = E;
      return F
    }
    if (y && A) {
      v = v || y.parentNode;
      var x = h(F);
      var B = null;
      var z = y.getStyle("position");
      var D = G.include("left") || G.include("right") || G.include("width");
      var C = G.include("top") || G.include("bottom") || G.include("height");
      if (v === document.viewport) {
        if (D) {
          B = document.viewport.getWidth()
        } else {
          if (C) {
            B = document.viewport.getHeight()
          }
        }
      } else {
        if (D) {
          B = $(v).measure("width")
        } else {
          if (C) {
            B = $(v).measure("height")
          }
        }
      }
      return (B === null) ? 0 : B * x
    }
    return 0
  }

  function g(u) {
    if (Object.isString(u) && u.endsWith("px")) {
      return u
    }
    return u + "px"
  }

  function j(v) {
    var u = v;
    while (v && v.parentNode) {
      var w = v.getStyle("display");
      if (w === "none") {
        return false
      }
      v = $(v.parentNode)
    }
    return true
  }
  var d = Prototype.K;
  if ("currentStyle" in document.documentElement) {
    d = function(u) {
      if (!u.currentStyle.hasLayout) {
        u.style.zoom = 1
      }
      return u
    }
  }

  function f(u) {
    if (u.include("border")) {
      u = u + "-width"
    }
    return u.camelize()
  }
  Element.Layout = Class.create(Hash, {
    initialize: function($super, v, u) {
      $super();
      this.element = $(v);
      Element.Layout.PROPERTIES.each(function(w) {
        this._set(w, null)
      }, this);
      if (u) {
        this._preComputing = true;
        this._begin();
        Element.Layout.PROPERTIES.each(this._compute, this);
        this._end();
        this._preComputing = false
      }
    },
    _set: function(v, u) {
      return Hash.prototype.set.call(this, v, u)
    },
    set: function(v, u) {
      throw "Properties of Element.Layout are read-only."
    },
    get: function($super, v) {
      var u = $super(v);
      return u === null ? this._compute(v) : u
    },
    _begin: function() {
      if (this._prepared) {
        return
      }
      var y = this.element;
      if (j(y)) {
        this._prepared = true;
        return
      }
      var A = {
        position: y.style.position || "",
        width: y.style.width || "",
        visibility: y.style.visibility || "",
        display: y.style.display || ""
      };
      y.store("prototype_original_styles", A);
      var B = y.getStyle("position"),
        u = y.getStyle("width");
      if (u === "0px" || u === null) {
        y.style.display = "block";
        u = y.getStyle("width")
      }
      var v = (B === "fixed") ? document.viewport : y.parentNode;
      y.setStyle({
        position: "absolute",
        visibility: "hidden",
        display: "block"
      });
      var w = y.getStyle("width");
      var x;
      if (u && (w === u)) {
        x = o(y, "width", v)
      } else {
        if (B === "absolute" || B === "fixed") {
          x = o(y, "width", v)
        } else {
          var C = y.parentNode,
            z = $(C).getLayout();
          x = z.get("width") - this.get("margin-left") - this.get("border-left") - this.get("padding-left") - this.get("padding-right") - this.get("border-right") - this.get("margin-right")
        }
      }
      y.setStyle({
        width: x + "px"
      });
      this._prepared = true
    },
    _end: function() {
      var v = this.element;
      var u = v.retrieve("prototype_original_styles");
      v.store("prototype_original_styles", null);
      v.setStyle(u);
      this._prepared = false
    },
    _compute: function(v) {
      var u = Element.Layout.COMPUTATIONS;
      if (!(v in u)) {
        throw "Property not found."
      }
      return this._set(v, u[v].call(this, this.element))
    },
    toObject: function() {
      var u = $A(arguments);
      var v = (u.length === 0) ? Element.Layout.PROPERTIES : u.join(" ").split(" ");
      var w = {};
      v.each(function(x) {
        if (!Element.Layout.PROPERTIES.include(x)) {
          return
        }
        var y = this.get(x);
        if (y != null) {
          w[x] = y
        }
      }, this);
      return w
    },
    toHash: function() {
      var u = this.toObject.apply(this, arguments);
      return new Hash(u)
    },
    toCSS: function() {
      var u = $A(arguments);
      var w = (u.length === 0) ? Element.Layout.PROPERTIES : u.join(" ").split(" ");
      var v = {};
      w.each(function(x) {
        if (!Element.Layout.PROPERTIES.include(x)) {
          return
        }
        if (Element.Layout.COMPOSITE_PROPERTIES.include(x)) {
          return
        }
        var y = this.get(x);
        if (y != null) {
          v[f(x)] = y + "px"
        }
      }, this);
      return v
    },
    inspect: function() {
      return "#<Element.Layout>"
    }
  });
  Object.extend(Element.Layout, {
    PROPERTIES: $w("height width top left right bottom border-left border-right border-top border-bottom padding-left padding-right padding-top padding-bottom margin-top margin-bottom margin-left margin-right padding-box-width padding-box-height border-box-width border-box-height margin-box-width margin-box-height"),
    COMPOSITE_PROPERTIES: $w("padding-box-width padding-box-height margin-box-width margin-box-height border-box-width border-box-height"),
    COMPUTATIONS: {
      height: function(w) {
        if (!this._preComputing) {
          this._begin()
        }
        var u = this.get("border-box-height");
        if (u <= 0) {
          if (!this._preComputing) {
            this._end()
          }
          return 0
        }
        var x = this.get("border-top"),
          v = this.get("border-bottom");
        var z = this.get("padding-top"),
          y = this.get("padding-bottom");
        if (!this._preComputing) {
          this._end()
        }
        return u - x - v - z - y
      },
      width: function(w) {
        if (!this._preComputing) {
          this._begin()
        }
        var v = this.get("border-box-width");
        if (v <= 0) {
          if (!this._preComputing) {
            this._end()
          }
          return 0
        }
        var z = this.get("border-left"),
          u = this.get("border-right");
        var x = this.get("padding-left"),
          y = this.get("padding-right");
        if (!this._preComputing) {
          this._end()
        }
        return v - z - u - x - y
      },
      "padding-box-height": function(v) {
        var u = this.get("height"),
          x = this.get("padding-top"),
          w = this.get("padding-bottom");
        return u + x + w
      },
      "padding-box-width": function(u) {
        var v = this.get("width"),
          w = this.get("padding-left"),
          x = this.get("padding-right");
        return v + w + x
      },
      "border-box-height": function(v) {
        if (!this._preComputing) {
          this._begin()
        }
        var u = v.offsetHeight;
        if (!this._preComputing) {
          this._end()
        }
        return u
      },
      "border-box-width": function(u) {
        if (!this._preComputing) {
          this._begin()
        }
        var v = u.offsetWidth;
        if (!this._preComputing) {
          this._end()
        }
        return v
      },
      "margin-box-height": function(v) {
        var u = this.get("border-box-height"),
          w = this.get("margin-top"),
          x = this.get("margin-bottom");
        if (u <= 0) {
          return 0
        }
        return u + w + x
      },
      "margin-box-width": function(w) {
        var v = this.get("border-box-width"),
          x = this.get("margin-left"),
          u = this.get("margin-right");
        if (v <= 0) {
          return 0
        }
        return v + x + u
      },
      top: function(u) {
        var v = u.positionedOffset();
        return v.top
      },
      bottom: function(u) {
        var x = u.positionedOffset(),
          v = u.getOffsetParent(),
          w = v.measure("height");
        var y = this.get("border-box-height");
        return w - y - x.top
      },
      left: function(u) {
        var v = u.positionedOffset();
        return v.left
      },
      right: function(w) {
        var y = w.positionedOffset(),
          x = w.getOffsetParent(),
          u = x.measure("width");
        var v = this.get("border-box-width");
        return u - v - y.left
      },
      "padding-top": function(u) {
        return o(u, "paddingTop")
      },
      "padding-bottom": function(u) {
        return o(u, "paddingBottom")
      },
      "padding-left": function(u) {
        return o(u, "paddingLeft")
      },
      "padding-right": function(u) {
        return o(u, "paddingRight")
      },
      "border-top": function(u) {
        return o(u, "borderTopWidth")
      },
      "border-bottom": function(u) {
        return o(u, "borderBottomWidth")
      },
      "border-left": function(u) {
        return o(u, "borderLeftWidth")
      },
      "border-right": function(u) {
        return o(u, "borderRightWidth")
      },
      "margin-top": function(u) {
        return o(u, "marginTop")
      },
      "margin-bottom": function(u) {
        return o(u, "marginBottom")
      },
      "margin-left": function(u) {
        return o(u, "marginLeft")
      },
      "margin-right": function(u) {
        return o(u, "marginRight")
      }
    }
  });
  if ("getBoundingClientRect" in document.documentElement) {
    Object.extend(Element.Layout.COMPUTATIONS, {
      right: function(v) {
        var w = d(v.getOffsetParent());
        var x = v.getBoundingClientRect(),
          u = w.getBoundingClientRect();
        return (u.right - x.right).round()
      },
      bottom: function(v) {
        var w = d(v.getOffsetParent());
        var x = v.getBoundingClientRect(),
          u = w.getBoundingClientRect();
        return (u.bottom - x.bottom).round()
      }
    })
  }
  Element.Offset = Class.create({
    initialize: function(v, u) {
      this.left = v.round();
      this.top = u.round();
      this[0] = this.left;
      this[1] = this.top
    },
    relativeTo: function(u) {
      return new Element.Offset(this.left - u.left, this.top - u.top)
    },
    inspect: function() {
      return "#<Element.Offset left: #{left} top: #{top}>".interpolate(this)
    },
    toString: function() {
      return "[#{left}, #{top}]".interpolate(this)
    },
    toArray: function() {
      return [this.left, this.top]
    }
  });

  function r(v, u) {
    return new Element.Layout(v, u)
  }

  function b(u, v) {
    return $(u).getLayout().get(v)
  }

  function n(v) {
    v = $(v);
    var z = Element.getStyle(v, "display");
    if (z && z !== "none") {
      return {
        width: v.offsetWidth,
        height: v.offsetHeight
      }
    }
    var w = v.style;
    var u = {
      visibility: w.visibility,
      position: w.position,
      display: w.display
    };
    var y = {
      visibility: "hidden",
      display: "block"
    };
    if (u.position !== "fixed") {
      y.position = "absolute"
    }
    Element.setStyle(v, y);
    var x = {
      width: v.offsetWidth,
      height: v.offsetHeight
    };
    Element.setStyle(v, u);
    return x
  }

  function l(u) {
    u = $(u);
    if (e(u) || c(u) || m(u) || k(u)) {
      return $(document.body)
    }
    var v = (Element.getStyle(u, "display") === "inline");
    if (!v && u.offsetParent) {
      return $(u.offsetParent)
    }
    while ((u = u.parentNode) && u !== document.body) {
      if (Element.getStyle(u, "position") !== "static") {
        return k(u) ? $(document.body) : $(u)
      }
    }
    return $(document.body)
  }

  function t(v) {
    v = $(v);
    var u = 0,
      w = 0;
    if (v.parentNode) {
      do {
        u += v.offsetTop || 0;
        w += v.offsetLeft || 0;
        v = v.offsetParent
      } while (v)
    }
    return new Element.Offset(w, u)
  }

  function p(v) {
    v = $(v);
    var w = v.getLayout();
    var u = 0,
      y = 0;
    do {
      u += v.offsetTop || 0;
      y += v.offsetLeft || 0;
      v = v.offsetParent;
      if (v) {
        if (m(v)) {
          break
        }
        var x = Element.getStyle(v, "position");
        if (x !== "static") {
          break
        }
      }
    } while (v);
    y -= w.get("margin-top");
    u -= w.get("margin-left");
    return new Element.Offset(y, u)
  }

  function a(v) {
    var u = 0,
      w = 0;
    do {
      u += v.scrollTop || 0;
      w += v.scrollLeft || 0;
      v = v.parentNode
    } while (v);
    return new Element.Offset(w, u)
  }

  function s(y) {
    v = $(v);
    var u = 0,
      x = 0,
      w = document.body;
    var v = y;
    do {
      u += v.offsetTop || 0;
      x += v.offsetLeft || 0;
      if (v.offsetParent == w && Element.getStyle(v, "position") == "absolute") {
        break
      }
    } while (v = v.offsetParent);
    v = y;
    do {
      if (v != w) {
        u -= v.scrollTop || 0;
        x -= v.scrollLeft || 0
      }
    } while (v = v.parentNode);
    return new Element.Offset(x, u)
  }

  function q(u) {
    u = $(u);
    if (Element.getStyle(u, "position") === "absolute") {
      return u
    }
    var y = l(u);
    var x = u.viewportOffset(),
      v = y.viewportOffset();
    var z = x.relativeTo(v);
    var w = u.getLayout();
    u.store("prototype_absolutize_original_styles", {
      left: u.getStyle("left"),
      top: u.getStyle("top"),
      width: u.getStyle("width"),
      height: u.getStyle("height")
    });
    u.setStyle({
      position: "absolute",
      top: z.top + "px",
      left: z.left + "px",
      width: w.get("width") + "px",
      height: w.get("height") + "px"
    });
    return u
  }

  function i(v) {
    v = $(v);
    if (Element.getStyle(v, "position") === "relative") {
      return v
    }
    var u = v.retrieve("prototype_absolutize_original_styles");
    if (u) {
      v.setStyle(u)
    }
    return v
  }
  if (Prototype.Browser.IE) {
    l = l.wrap(function(w, v) {
      v = $(v);
      if (e(v) || c(v) || m(v) || k(v)) {
        return $(document.body)
      }
      var u = v.getStyle("position");
      if (u !== "static") {
        return w(v)
      }
      v.setStyle({
        position: "relative"
      });
      var x = w(v);
      v.setStyle({
        position: u
      });
      return x
    });
    p = p.wrap(function(x, v) {
      v = $(v);
      if (!v.parentNode) {
        return new Element.Offset(0, 0)
      }
      var u = v.getStyle("position");
      if (u !== "static") {
        return x(v)
      }
      var w = v.getOffsetParent();
      if (w && w.getStyle("position") === "fixed") {
        d(w)
      }
      v.setStyle({
        position: "relative"
      });
      var y = x(v);
      v.setStyle({
        position: u
      });
      return y
    })
  } else {
    if (Prototype.Browser.Webkit) {
      t = function(v) {
        v = $(v);
        var u = 0,
          w = 0;
        do {
          u += v.offsetTop || 0;
          w += v.offsetLeft || 0;
          if (v.offsetParent == document.body) {
            if (Element.getStyle(v, "position") == "absolute") {
              break
            }
          }
          v = v.offsetParent
        } while (v);
        return new Element.Offset(w, u)
      }
    }
  }
  Element.addMethods({
    getLayout: r,
    measure: b,
    getDimensions: n,
    getOffsetParent: l,
    cumulativeOffset: t,
    positionedOffset: p,
    cumulativeScrollOffset: a,
    viewportOffset: s,
    absolutize: q,
    relativize: i
  });

  function m(u) {
    return u.nodeName.toUpperCase() === "BODY"
  }

  function k(u) {
    return u.nodeName.toUpperCase() === "HTML"
  }

  function e(u) {
    return u.nodeType === Node.DOCUMENT_NODE
  }

  function c(u) {
    return u !== document.body && !Element.descendantOf(u, document.body)
  }
  if ("getBoundingClientRect" in document.documentElement) {
    Element.addMethods({
      viewportOffset: function(u) {
        u = $(u);
        if (c(u)) {
          return new Element.Offset(0, 0)
        }
        var v = u.getBoundingClientRect(),
          w = document.documentElement;
        return new Element.Offset(v.left - w.clientLeft, v.top - w.clientTop)
      }
    })
  }
})();
window.$$ = function() {
  var a = $A(arguments).join(", ");
  return Prototype.Selector.select(a, document)
};
Prototype.Selector = (function() {
  function a() {
    throw new Error('Method "Prototype.Selector.select" must be defined.')
  }

  function c() {
    throw new Error('Method "Prototype.Selector.match" must be defined.')
  }

  function d(l, m, h) {
    h = h || 0;
    var g = Prototype.Selector.match,
      k = l.length,
      f = 0,
      j;
    for (j = 0; j < k; j++) {
      if (g(l[j], m) && h == f++) {
        return Element.extend(l[j])
      }
    }
  }

  function e(h) {
    for (var f = 0, g = h.length; f < g; f++) {
      Element.extend(h[f])
    }
    return h
  }
  var b = Prototype.K;
  return {
    select: a,
    match: c,
    find: d,
    extendElements: (Element.extend === b) ? b : e,
    extendElement: Element.extend
  }
})();
Prototype._original_property = window.Sizzle;
/*!
 * Sizzle CSS Selector Engine - v1.0
 *  Copyright 2009, The Dojo Foundation
 *  Released under the MIT, BSD, and GPL Licenses.
 *  More information: http://sizzlejs.com/
 */
(function() {
  var q = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^[\]]*\]|['"][^'"]*['"]|[^[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
    j = 0,
    d = Object.prototype.toString,
    o = false,
    i = true;
  [0, 0].sort(function() {
    i = false;
    return 0
  });
  var b = function(E, u, B, w) {
    B = B || [];
    var e = u = u || document;
    if (u.nodeType !== 1 && u.nodeType !== 9) {
      return []
    }
    if (!E || typeof E !== "string") {
      return B
    }
    var C = [],
      D, z, I, H, A, t, s = true,
      x = p(u),
      G = E;
    while ((q.exec(""), D = q.exec(G)) !== null) {
      G = D[3];
      C.push(D[1]);
      if (D[2]) {
        t = D[3];
        break
      }
    }
    if (C.length > 1 && k.exec(E)) {
      if (C.length === 2 && f.relative[C[0]]) {
        z = g(C[0] + C[1], u)
      } else {
        z = f.relative[C[0]] ? [u] : b(C.shift(), u);
        while (C.length) {
          E = C.shift();
          if (f.relative[E]) {
            E += C.shift()
          }
          z = g(E, z)
        }
      }
    } else {
      if (!w && C.length > 1 && u.nodeType === 9 && !x && f.match.ID.test(C[0]) && !f.match.ID.test(C[C.length - 1])) {
        var J = b.find(C.shift(), u, x);
        u = J.expr ? b.filter(J.expr, J.set)[0] : J.set[0]
      }
      if (u) {
        var J = w ? {
          expr: C.pop(),
          set: a(w)
        } : b.find(C.pop(), C.length === 1 && (C[0] === "~" || C[0] === "+") && u.parentNode ? u.parentNode : u, x);
        z = J.expr ? b.filter(J.expr, J.set) : J.set;
        if (C.length > 0) {
          I = a(z)
        } else {
          s = false
        }
        while (C.length) {
          var v = C.pop(),
            y = v;
          if (!f.relative[v]) {
            v = ""
          } else {
            y = C.pop()
          }
          if (y == null) {
            y = u
          }
          f.relative[v](I, y, x)
        }
      } else {
        I = C = []
      }
    }
    if (!I) {
      I = z
    }
    if (!I) {
      throw "Syntax error, unrecognized expression: " + (v || E)
    }
    if (d.call(I) === "[object Array]") {
      if (!s) {
        B.push.apply(B, I)
      } else {
        if (u && u.nodeType === 1) {
          for (var F = 0; I[F] != null; F++) {
            if (I[F] && (I[F] === true || I[F].nodeType === 1 && h(u, I[F]))) {
              B.push(z[F])
            }
          }
        } else {
          for (var F = 0; I[F] != null; F++) {
            if (I[F] && I[F].nodeType === 1) {
              B.push(z[F])
            }
          }
        }
      }
    } else {
      a(I, B)
    }
    if (t) {
      b(t, e, B, w);
      b.uniqueSort(B)
    }
    return B
  };
  b.uniqueSort = function(s) {
    if (c) {
      o = i;
      s.sort(c);
      if (o) {
        for (var e = 1; e < s.length; e++) {
          if (s[e] === s[e - 1]) {
            s.splice(e--, 1)
          }
        }
      }
    }
    return s
  };
  b.matches = function(e, s) {
    return b(e, null, null, s)
  };
  b.find = function(y, e, z) {
    var x, v;
    if (!y) {
      return []
    }
    for (var u = 0, t = f.order.length; u < t; u++) {
      var w = f.order[u],
        v;
      if ((v = f.leftMatch[w].exec(y))) {
        var s = v[1];
        v.splice(1, 1);
        if (s.substr(s.length - 1) !== "\\") {
          v[1] = (v[1] || "").replace(/\\/g, "");
          x = f.find[w](v, e, z);
          if (x != null) {
            y = y.replace(f.match[w], "");
            break
          }
        }
      }
    }
    if (!x) {
      x = e.getElementsByTagName("*")
    }
    return {
      set: x,
      expr: y
    }
  };
  b.filter = function(B, A, E, u) {
    var t = B,
      G = [],
      y = A,
      w, e, x = A && A[0] && p(A[0]);
    while (B && A.length) {
      for (var z in f.filter) {
        if ((w = f.match[z].exec(B)) != null) {
          var s = f.filter[z],
            F, D;
          e = false;
          if (y == G) {
            G = []
          }
          if (f.preFilter[z]) {
            w = f.preFilter[z](w, y, E, G, u, x);
            if (!w) {
              e = F = true
            } else {
              if (w === true) {
                continue
              }
            }
          }
          if (w) {
            for (var v = 0;
              (D = y[v]) != null; v++) {
              if (D) {
                F = s(D, w, v, y);
                var C = u ^ !!F;
                if (E && F != null) {
                  if (C) {
                    e = true
                  } else {
                    y[v] = false
                  }
                } else {
                  if (C) {
                    G.push(D);
                    e = true
                  }
                }
              }
            }
          }
          if (F !== undefined) {
            if (!E) {
              y = G
            }
            B = B.replace(f.match[z], "");
            if (!e) {
              return []
            }
            break
          }
        }
      }
      if (B == t) {
        if (e == null) {
          throw "Syntax error, unrecognized expression: " + B
        } else {
          break
        }
      }
      t = B
    }
    return y
  };
  var f = b.selectors = {
    order: ["ID", "NAME", "TAG"],
    match: {
      ID: /#((?:[\w\u00c0-\uFFFF-]|\\.)+)/,
      CLASS: /\.((?:[\w\u00c0-\uFFFF-]|\\.)+)/,
      NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF-]|\\.)+)['"]*\]/,
      ATTR: /\[\s*((?:[\w\u00c0-\uFFFF-]|\\.)+)\s*(?:(\S?=)\s*(['"]*)(.*?)\3|)\s*\]/,
      TAG: /^((?:[\w\u00c0-\uFFFF\*-]|\\.)+)/,
      CHILD: /:(only|nth|last|first)-child(?:\((even|odd|[\dn+-]*)\))?/,
      POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^-]|$)/,
      PSEUDO: /:((?:[\w\u00c0-\uFFFF-]|\\.)+)(?:\((['"]*)((?:\([^\)]+\)|[^\2\(\)]*)+)\2\))?/
    },
    leftMatch: {},
    attrMap: {
      "class": "className",
      "for": "htmlFor"
    },
    attrHandle: {
      href: function(e) {
        return e.getAttribute("href")
      }
    },
    relative: {
      "+": function(y, e, x) {
        var v = typeof e === "string",
          z = v && !/\W/.test(e),
          w = v && !z;
        if (z && !x) {
          e = e.toUpperCase()
        }
        for (var u = 0, t = y.length, s; u < t; u++) {
          if ((s = y[u])) {
            while ((s = s.previousSibling) && s.nodeType !== 1) {}
            y[u] = w || s && s.nodeName === e ? s || false : s === e
          }
        }
        if (w) {
          b.filter(e, y, true)
        }
      },
      ">": function(x, s, y) {
        var v = typeof s === "string";
        if (v && !/\W/.test(s)) {
          s = y ? s : s.toUpperCase();
          for (var t = 0, e = x.length; t < e; t++) {
            var w = x[t];
            if (w) {
              var u = w.parentNode;
              x[t] = u.nodeName === s ? u : false
            }
          }
        } else {
          for (var t = 0, e = x.length; t < e; t++) {
            var w = x[t];
            if (w) {
              x[t] = v ? w.parentNode : w.parentNode === s
            }
          }
          if (v) {
            b.filter(s, x, true)
          }
        }
      },
      "": function(u, s, w) {
        var t = j++,
          e = r;
        if (!/\W/.test(s)) {
          var v = s = w ? s : s.toUpperCase();
          e = n
        }
        e("parentNode", s, t, u, v, w)
      },
      "~": function(u, s, w) {
        var t = j++,
          e = r;
        if (typeof s === "string" && !/\W/.test(s)) {
          var v = s = w ? s : s.toUpperCase();
          e = n
        }
        e("previousSibling", s, t, u, v, w)
      }
    },
    find: {
      ID: function(s, t, u) {
        if (typeof t.getElementById !== "undefined" && !u) {
          var e = t.getElementById(s[1]);
          return e ? [e] : []
        }
      },
      NAME: function(t, w, x) {
        if (typeof w.getElementsByName !== "undefined") {
          var s = [],
            v = w.getElementsByName(t[1]);
          for (var u = 0, e = v.length; u < e; u++) {
            if (v[u].getAttribute("name") === t[1]) {
              s.push(v[u])
            }
          }
          return s.length === 0 ? null : s
        }
      },
      TAG: function(e, s) {
        return s.getElementsByTagName(e[1])
      }
    },
    preFilter: {
      CLASS: function(u, s, t, e, x, y) {
        u = " " + u[1].replace(/\\/g, "") + " ";
        if (y) {
          return u
        }
        for (var v = 0, w;
          (w = s[v]) != null; v++) {
          if (w) {
            if (x ^ (w.className && (" " + w.className + " ").indexOf(u) >= 0)) {
              if (!t) {
                e.push(w)
              }
            } else {
              if (t) {
                s[v] = false
              }
            }
          }
        }
        return false
      },
      ID: function(e) {
        return e[1].replace(/\\/g, "")
      },
      TAG: function(s, e) {
        for (var t = 0; e[t] === false; t++) {}
        return e[t] && p(e[t]) ? s[1] : s[1].toUpperCase()
      },
      CHILD: function(e) {
        if (e[1] == "nth") {
          var s = /(-?)(\d*)n((?:\+|-)?\d*)/.exec(e[2] == "even" && "2n" || e[2] == "odd" && "2n+1" || !/\D/.test(e[2]) && "0n+" + e[2] || e[2]);
          e[2] = (s[1] + (s[2] || 1)) - 0;
          e[3] = s[3] - 0
        }
        e[0] = j++;
        return e
      },
      ATTR: function(v, s, t, e, w, x) {
        var u = v[1].replace(/\\/g, "");
        if (!x && f.attrMap[u]) {
          v[1] = f.attrMap[u]
        }
        if (v[2] === "~=") {
          v[4] = " " + v[4] + " "
        }
        return v
      },
      PSEUDO: function(v, s, t, e, w) {
        if (v[1] === "not") {
          if ((q.exec(v[3]) || "").length > 1 || /^\w/.test(v[3])) {
            v[3] = b(v[3], null, null, s)
          } else {
            var u = b.filter(v[3], s, t, true ^ w);
            if (!t) {
              e.push.apply(e, u)
            }
            return false
          }
        } else {
          if (f.match.POS.test(v[0]) || f.match.CHILD.test(v[0])) {
            return true
          }
        }
        return v
      },
      POS: function(e) {
        e.unshift(true);
        return e
      }
    },
    filters: {
      enabled: function(e) {
        return e.disabled === false && e.type !== "hidden"
      },
      disabled: function(e) {
        return e.disabled === true
      },
      checked: function(e) {
        return e.checked === true
      },
      selected: function(e) {
        e.parentNode.selectedIndex;
        return e.selected === true
      },
      parent: function(e) {
        return !!e.firstChild
      },
      empty: function(e) {
        return !e.firstChild
      },
      has: function(t, s, e) {
        return !!b(e[3], t).length
      },
      header: function(e) {
        return /h\d/i.test(e.nodeName)
      },
      text: function(e) {
        return "text" === e.type
      },
      radio: function(e) {
        return "radio" === e.type
      },
      checkbox: function(e) {
        return "checkbox" === e.type
      },
      file: function(e) {
        return "file" === e.type
      },
      password: function(e) {
        return "password" === e.type
      },
      submit: function(e) {
        return "submit" === e.type
      },
      image: function(e) {
        return "image" === e.type
      },
      reset: function(e) {
        return "reset" === e.type
      },
      button: function(e) {
        return "button" === e.type || e.nodeName.toUpperCase() === "BUTTON"
      },
      input: function(e) {
        return /input|select|textarea|button/i.test(e.nodeName)
      }
    },
    setFilters: {
      first: function(s, e) {
        return e === 0
      },
      last: function(t, s, e, u) {
        return s === u.length - 1
      },
      even: function(s, e) {
        return e % 2 === 0
      },
      odd: function(s, e) {
        return e % 2 === 1
      },
      lt: function(t, s, e) {
        return s < e[3] - 0
      },
      gt: function(t, s, e) {
        return s > e[3] - 0
      },
      nth: function(t, s, e) {
        return e[3] - 0 == s
      },
      eq: function(t, s, e) {
        return e[3] - 0 == s
      }
    },
    filter: {
      PSEUDO: function(x, t, u, y) {
        var s = t[1],
          v = f.filters[s];
        if (v) {
          return v(x, u, t, y)
        } else {
          if (s === "contains") {
            return (x.textContent || x.innerText || "").indexOf(t[3]) >= 0
          } else {
            if (s === "not") {
              var w = t[3];
              for (var u = 0, e = w.length; u < e; u++) {
                if (w[u] === x) {
                  return false
                }
              }
              return true
            }
          }
        }
      },
      CHILD: function(e, u) {
        var x = u[1],
          s = e;
        switch (x) {
          case "only":
          case "first":
            while ((s = s.previousSibling)) {
              if (s.nodeType === 1) {
                return false
              }
            }
            if (x == "first") {
              return true
            }
            s = e;
          case "last":
            while ((s = s.nextSibling)) {
              if (s.nodeType === 1) {
                return false
              }
            }
            return true;
          case "nth":
            var t = u[2],
              A = u[3];
            if (t == 1 && A == 0) {
              return true
            }
            var w = u[0],
              z = e.parentNode;
            if (z && (z.sizcache !== w || !e.nodeIndex)) {
              var v = 0;
              for (s = z.firstChild; s; s = s.nextSibling) {
                if (s.nodeType === 1) {
                  s.nodeIndex = ++v
                }
              }
              z.sizcache = w
            }
            var y = e.nodeIndex - A;
            if (t == 0) {
              return y == 0
            } else {
              return (y % t == 0 && y / t >= 0)
            }
        }
      },
      ID: function(s, e) {
        return s.nodeType === 1 && s.getAttribute("id") === e
      },
      TAG: function(s, e) {
        return (e === "*" && s.nodeType === 1) || s.nodeName === e
      },
      CLASS: function(s, e) {
        return (" " + (s.className || s.getAttribute("class")) + " ").indexOf(e) > -1
      },
      ATTR: function(w, u) {
        var t = u[1],
          e = f.attrHandle[t] ? f.attrHandle[t](w) : w[t] != null ? w[t] : w.getAttribute(t),
          x = e + "",
          v = u[2],
          s = u[4];
        return e == null ? v === "!=" : v === "=" ? x === s : v === "*=" ? x.indexOf(s) >= 0 : v === "~=" ? (" " + x + " ").indexOf(s) >= 0 : !s ? x && e !== false : v === "!=" ? x != s : v === "^=" ? x.indexOf(s) === 0 : v === "$=" ? x.substr(x.length - s.length) === s : v === "|=" ? x === s || x.substr(0, s.length + 1) === s + "-" : false
      },
      POS: function(v, s, t, w) {
        var e = s[2],
          u = f.setFilters[e];
        if (u) {
          return u(v, t, s, w)
        }
      }
    }
  };
  var k = f.match.POS;
  for (var m in f.match) {
    f.match[m] = new RegExp(f.match[m].source + /(?![^\[]*\])(?![^\(]*\))/.source);
    f.leftMatch[m] = new RegExp(/(^(?:.|\r|\n)*?)/.source + f.match[m].source)
  }
  var a = function(s, e) {
    s = Array.prototype.slice.call(s, 0);
    if (e) {
      e.push.apply(e, s);
      return e
    }
    return s
  };
  try {
    Array.prototype.slice.call(document.documentElement.childNodes, 0)
  } catch (l) {
    a = function(v, u) {
      var s = u || [];
      if (d.call(v) === "[object Array]") {
        Array.prototype.push.apply(s, v)
      } else {
        if (typeof v.length === "number") {
          for (var t = 0, e = v.length; t < e; t++) {
            s.push(v[t])
          }
        } else {
          for (var t = 0; v[t]; t++) {
            s.push(v[t])
          }
        }
      }
      return s
    }
  }
  var c;
  if (document.documentElement.compareDocumentPosition) {
    c = function(s, e) {
      if (!s.compareDocumentPosition || !e.compareDocumentPosition) {
        if (s == e) {
          o = true
        }
        return 0
      }
      var t = s.compareDocumentPosition(e) & 4 ? -1 : s === e ? 0 : 1;
      if (t === 0) {
        o = true
      }
      return t
    }
  } else {
    if ("sourceIndex" in document.documentElement) {
      c = function(s, e) {
        if (!s.sourceIndex || !e.sourceIndex) {
          if (s == e) {
            o = true
          }
          return 0
        }
        var t = s.sourceIndex - e.sourceIndex;
        if (t === 0) {
          o = true
        }
        return t
      }
    } else {
      if (document.createRange) {
        c = function(u, s) {
          if (!u.ownerDocument || !s.ownerDocument) {
            if (u == s) {
              o = true
            }
            return 0
          }
          var t = u.ownerDocument.createRange(),
            e = s.ownerDocument.createRange();
          t.setStart(u, 0);
          t.setEnd(u, 0);
          e.setStart(s, 0);
          e.setEnd(s, 0);
          var v = t.compareBoundaryPoints(Range.START_TO_END, e);
          if (v === 0) {
            o = true
          }
          return v
        }
      }
    }
  }(function() {
    var s = document.createElement("div"),
      t = "script" + (new Date).getTime();
    s.innerHTML = "<a name='" + t + "'/>";
    var e = document.documentElement;
    e.insertBefore(s, e.firstChild);
    if (!!document.getElementById(t)) {
      f.find.ID = function(v, w, x) {
        if (typeof w.getElementById !== "undefined" && !x) {
          var u = w.getElementById(v[1]);
          return u ? u.id === v[1] || typeof u.getAttributeNode !== "undefined" && u.getAttributeNode("id").nodeValue === v[1] ? [u] : undefined : []
        }
      };
      f.filter.ID = function(w, u) {
        var v = typeof w.getAttributeNode !== "undefined" && w.getAttributeNode("id");
        return w.nodeType === 1 && v && v.nodeValue === u
      }
    }
    e.removeChild(s);
    e = s = null
  })();
  (function() {
    var e = document.createElement("div");
    e.appendChild(document.createComment(""));
    if (e.getElementsByTagName("*").length > 0) {
      f.find.TAG = function(s, w) {
        var v = w.getElementsByTagName(s[1]);
        if (s[1] === "*") {
          var u = [];
          for (var t = 0; v[t]; t++) {
            if (v[t].nodeType === 1) {
              u.push(v[t])
            }
          }
          v = u
        }
        return v
      }
    }
    e.innerHTML = "<a href='#'></a>";
    if (e.firstChild && typeof e.firstChild.getAttribute !== "undefined" && e.firstChild.getAttribute("href") !== "#") {
      f.attrHandle.href = function(s) {
        return s.getAttribute("href", 2)
      }
    }
    e = null
  })();
  if (document.querySelectorAll) {
    (function() {
      var e = b,
        t = document.createElement("div");
      t.innerHTML = "<p class='TEST'></p>";
      if (t.querySelectorAll && t.querySelectorAll(".TEST").length === 0) {
        return
      }
      b = function(x, w, u, v) {
        w = w || document;
        if (!v && w.nodeType === 9 && !p(w)) {
          try {
            return a(w.querySelectorAll(x), u)
          } catch (y) {}
        }
        return e(x, w, u, v)
      };
      for (var s in e) {
        b[s] = e[s]
      }
      t = null
    })()
  }
  if (document.getElementsByClassName && document.documentElement.getElementsByClassName) {
    (function() {
      var e = document.createElement("div");
      e.innerHTML = "<div class='test e'></div><div class='test'></div>";
      if (e.getElementsByClassName("e").length === 0) {
        return
      }
      e.lastChild.className = "e";
      if (e.getElementsByClassName("e").length === 1) {
        return
      }
      f.order.splice(1, 0, "CLASS");
      f.find.CLASS = function(s, t, u) {
        if (typeof t.getElementsByClassName !== "undefined" && !u) {
          return t.getElementsByClassName(s[1])
        }
      };
      e = null
    })()
  }

  function n(s, x, w, B, y, A) {
    var z = s == "previousSibling" && !A;
    for (var u = 0, t = B.length; u < t; u++) {
      var e = B[u];
      if (e) {
        if (z && e.nodeType === 1) {
          e.sizcache = w;
          e.sizset = u
        }
        e = e[s];
        var v = false;
        while (e) {
          if (e.sizcache === w) {
            v = B[e.sizset];
            break
          }
          if (e.nodeType === 1 && !A) {
            e.sizcache = w;
            e.sizset = u
          }
          if (e.nodeName === x) {
            v = e;
            break
          }
          e = e[s]
        }
        B[u] = v
      }
    }
  }

  function r(s, x, w, B, y, A) {
    var z = s == "previousSibling" && !A;
    for (var u = 0, t = B.length; u < t; u++) {
      var e = B[u];
      if (e) {
        if (z && e.nodeType === 1) {
          e.sizcache = w;
          e.sizset = u
        }
        e = e[s];
        var v = false;
        while (e) {
          if (e.sizcache === w) {
            v = B[e.sizset];
            break
          }
          if (e.nodeType === 1) {
            if (!A) {
              e.sizcache = w;
              e.sizset = u
            }
            if (typeof x !== "string") {
              if (e === x) {
                v = true;
                break
              }
            } else {
              if (b.filter(x, [e]).length > 0) {
                v = e;
                break
              }
            }
          }
          e = e[s]
        }
        B[u] = v
      }
    }
  }
  var h = document.compareDocumentPosition ? function(s, e) {
    return s.compareDocumentPosition(e) & 16
  } : function(s, e) {
    return s !== e && (s.contains ? s.contains(e) : true)
  };
  var p = function(e) {
    return e.nodeType === 9 && e.documentElement.nodeName !== "HTML" || !!e.ownerDocument && e.ownerDocument.documentElement.nodeName !== "HTML"
  };
  var g = function(e, y) {
    var u = [],
      v = "",
      w, t = y.nodeType ? [y] : y;
    while ((w = f.match.PSEUDO.exec(e))) {
      v += w[0];
      e = e.replace(f.match.PSEUDO, "")
    }
    e = f.relative[e] ? e + "*" : e;
    for (var x = 0, s = t.length; x < s; x++) {
      b(e, t[x], u)
    }
    return b.filter(v, u)
  };
  window.Sizzle = b
})();
(function(c) {
  var d = Prototype.Selector.extendElements;

  function a(e, f) {
    return d(c(e, f || document))
  }

  function b(f, e) {
    return c.matches(e, [f]).length == 1
  }
  Prototype.Selector.engine = c;
  Prototype.Selector.select = a;
  Prototype.Selector.match = b
})(Sizzle);
window.Sizzle = Prototype._original_property;
delete Prototype._original_property;
var Form = {
  reset: function(a) {
    a = $(a);
    a.reset();
    return a
  },
  serializeElements: function(h, d) {
    if (typeof d != "object") {
      d = {
        hash: !!d
      }
    } else {
      if (Object.isUndefined(d.hash)) {
        d.hash = true
      }
    }
    var e, g, a = false,
      f = d.submit,
      b, c;
    if (d.hash) {
      c = {};
      b = function(i, j, k) {
        if (j in i) {
          if (!Object.isArray(i[j])) {
            i[j] = [i[j]]
          }
          i[j].push(k)
        } else {
          i[j] = k
        }
        return i
      }
    } else {
      c = "";
      b = function(i, j, k) {
        return i + (i ? "&" : "") + encodeURIComponent(j) + "=" + encodeURIComponent(k)
      }
    }
    return h.inject(c, function(i, j) {
      if (!j.disabled && j.name) {
        e = j.name;
        g = $(j).getValue();
        if (g != null && j.type != "file" && (j.type != "submit" || (!a && f !== false && (!f || e == f) && (a = true)))) {
          i = b(i, e, g)
        }
      }
      return i
    })
  }
};
Form.Methods = {
  serialize: function(b, a) {
    return Form.serializeElements(Form.getElements(b), a)
  },
  getElements: function(e) {
    var f = $(e).getElementsByTagName("*"),
      d, a = [],
      c = Form.Element.Serializers;
    for (var b = 0; d = f[b]; b++) {
      a.push(d)
    }
    return a.inject([], function(g, h) {
      if (c[h.tagName.toLowerCase()]) {
        g.push(Element.extend(h))
      }
      return g
    })
  },
  getInputs: function(g, c, d) {
    g = $(g);
    var a = g.getElementsByTagName("input");
    if (!c && !d) {
      return $A(a).map(Element.extend)
    }
    for (var e = 0, h = [], f = a.length; e < f; e++) {
      var b = a[e];
      if ((c && b.type != c) || (d && b.name != d)) {
        continue
      }
      h.push(Element.extend(b))
    }
    return h
  },
  disable: function(a) {
    a = $(a);
    Form.getElements(a).invoke("disable");
    return a
  },
  enable: function(a) {
    a = $(a);
    Form.getElements(a).invoke("enable");
    return a
  },
  findFirstElement: function(b) {
    var c = $(b).getElements().findAll(function(d) {
      return "hidden" != d.type && !d.disabled
    });
    var a = c.findAll(function(d) {
      return d.hasAttribute("tabIndex") && d.tabIndex >= 0
    }).sortBy(function(d) {
      return d.tabIndex
    }).first();
    return a ? a : c.find(function(d) {
      return /^(?:input|select|textarea)$/i.test(d.tagName)
    })
  },
  focusFirstElement: function(b) {
    b = $(b);
    var a = b.findFirstElement();
    if (a) {
      a.activate()
    }
    return b
  },
  request: function(b, a) {
    b = $(b), a = Object.clone(a || {});
    var d = a.parameters,
      c = b.readAttribute("action") || "";
    if (c.blank()) {
      c = window.location.href
    }
    a.parameters = b.serialize(true);
    if (d) {
      if (Object.isString(d)) {
        d = d.toQueryParams()
      }
      Object.extend(a.parameters, d)
    }
    if (b.hasAttribute("method") && !a.method) {
      a.method = b.method
    }
    return new Ajax.Request(c, a)
  }
};
Form.Element = {
  focus: function(a) {
    $(a).focus();
    return a
  },
  select: function(a) {
    $(a).select();
    return a
  }
};
Form.Element.Methods = {
  serialize: function(a) {
    a = $(a);
    if (!a.disabled && a.name) {
      var b = a.getValue();
      if (b != undefined) {
        var c = {};
        c[a.name] = b;
        return Object.toQueryString(c)
      }
    }
    return ""
  },
  getValue: function(a) {
    a = $(a);
    var b = a.tagName.toLowerCase();
    return Form.Element.Serializers[b](a)
  },
  setValue: function(a, b) {
    a = $(a);
    var c = a.tagName.toLowerCase();
    Form.Element.Serializers[c](a, b);
    return a
  },
  clear: function(a) {
    $(a).value = "";
    return a
  },
  present: function(a) {
    return $(a).value != ""
  },
  activate: function(a) {
    a = $(a);
    try {
      a.focus();
      if (a.select && (a.tagName.toLowerCase() != "input" || !(/^(?:button|reset|submit)$/i.test(a.type)))) {
        a.select()
      }
    } catch (b) {}
    return a
  },
  disable: function(a) {
    a = $(a);
    a.disabled = true;
    return a
  },
  enable: function(a) {
    a = $(a);
    a.disabled = false;
    return a
  }
};
var Field = Form.Element;
var $F = Form.Element.Methods.getValue;
Form.Element.Serializers = (function() {
  function b(h, i) {
    switch (h.type.toLowerCase()) {
      case "checkbox":
      case "radio":
        return f(h, i);
      default:
        return e(h, i)
    }
  }

  function f(h, i) {
    if (Object.isUndefined(i)) {
      return h.checked ? h.value : null
    } else {
      h.checked = !!i
    }
  }

  function e(h, i) {
    if (Object.isUndefined(i)) {
      return h.value
    } else {
      h.value = i
    }
  }

  function a(k, n) {
    if (Object.isUndefined(n)) {
      return (k.type === "select-one" ? c : d)(k)
    }
    var j, l, o = !Object.isArray(n);
    for (var h = 0, m = k.length; h < m; h++) {
      j = k.options[h];
      l = this.optionValue(j);
      if (o) {
        if (l == n) {
          j.selected = true;
          return
        }
      } else {
        j.selected = n.include(l)
      }
    }
  }

  function c(i) {
    var h = i.selectedIndex;
    return h >= 0 ? g(i.options[h]) : null
  }

  function d(l) {
    var h, m = l.length;
    if (!m) {
      return null
    }
    for (var k = 0, h = []; k < m; k++) {
      var j = l.options[k];
      if (j.selected) {
        h.push(g(j))
      }
    }
    return h
  }

  function g(h) {
    return Element.hasAttribute(h, "value") ? h.value : h.text
  }
  return {
    input: b,
    inputSelector: f,
    textarea: e,
    select: a,
    selectOne: c,
    selectMany: d,
    optionValue: g,
    button: e
  }
})();
Abstract.TimedObserver = Class.create(PeriodicalExecuter, {
  initialize: function($super, a, b, c) {
    $super(c, b);
    this.element = $(a);
    this.lastValue = this.getValue()
  },
  execute: function() {
    var a = this.getValue();
    if (Object.isString(this.lastValue) && Object.isString(a) ? this.lastValue != a : String(this.lastValue) != String(a)) {
      this.callback(this.element, a);
      this.lastValue = a
    }
  }
});
Form.Element.Observer = Class.create(Abstract.TimedObserver, {
  getValue: function() {
    return Form.Element.getValue(this.element)
  }
});
Form.Observer = Class.create(Abstract.TimedObserver, {
  getValue: function() {
    return Form.serialize(this.element)
  }
});
Abstract.EventObserver = Class.create({
  initialize: function(a, b) {
    this.element = $(a);
    this.callback = b;
    this.lastValue = this.getValue();
    if (this.element.tagName.toLowerCase() == "form") {
      this.registerFormCallbacks()
    } else {
      this.registerCallback(this.element)
    }
  },
  onElementEvent: function() {
    var a = this.getValue();
    if (this.lastValue != a) {
      this.callback(this.element, a);
      this.lastValue = a
    }
  },
  registerFormCallbacks: function() {
    Form.getElements(this.element).each(this.registerCallback, this)
  },
  registerCallback: function(a) {
    if (a.type) {
      switch (a.type.toLowerCase()) {
        case "checkbox":
        case "radio":
          Event.observe(a, "click", this.onElementEvent.bind(this));
          break;
        default:
          Event.observe(a, "change", this.onElementEvent.bind(this));
          break
      }
    }
  }
});
Form.Element.EventObserver = Class.create(Abstract.EventObserver, {
  getValue: function() {
    return Form.Element.getValue(this.element)
  }
});
Form.EventObserver = Class.create(Abstract.EventObserver, {
  getValue: function() {
    return Form.serialize(this.element)
  }
});
(function() {
  var C = {
    KEY_BACKSPACE: 8,
    KEY_TAB: 9,
    KEY_RETURN: 13,
    KEY_ESC: 27,
    KEY_LEFT: 37,
    KEY_UP: 38,
    KEY_RIGHT: 39,
    KEY_DOWN: 40,
    KEY_DELETE: 46,
    KEY_HOME: 36,
    KEY_END: 35,
    KEY_PAGEUP: 33,
    KEY_PAGEDOWN: 34,
    KEY_INSERT: 45,
    cache: {}
  };
  var f = document.documentElement;
  var D = "onmouseenter" in f && "onmouseleave" in f;
  var a = function(E) {
    return false
  };
  if (window.attachEvent) {
    if (window.addEventListener) {
      a = function(E) {
        return !(E instanceof window.Event)
      }
    } else {
      a = function(E) {
        return true
      }
    }
  }
  var r;

  function A(F, E) {
    return F.which ? (F.which === E + 1) : (F.button === E)
  }
  var o = {
    0: 1,
    1: 4,
    2: 2
  };

  function y(F, E) {
    return F.button === o[E]
  }

  function B(F, E) {
    switch (E) {
      case 0:
        return F.which == 1 && !F.metaKey;
      case 1:
        return F.which == 2 || (F.which == 1 && F.metaKey);
      case 2:
        return F.which == 3;
      default:
        return false
    }
  }
  if (window.attachEvent) {
    if (!window.addEventListener) {
      r = y
    } else {
      r = function(F, E) {
        return a(F) ? y(F, E) : A(F, E)
      }
    }
  } else {
    if (Prototype.Browser.WebKit) {
      r = B
    } else {
      r = A
    }
  }

  function v(E) {
    return r(E, 0)
  }

  function t(E) {
    return r(E, 1)
  }

  function n(E) {
    return r(E, 2)
  }

  function d(G) {
    G = C.extend(G);
    var F = G.target,
      E = G.type,
      H = G.currentTarget;
    if (H && H.tagName) {
      if (E === "load" || E === "error" || (E === "click" && H.tagName.toLowerCase() === "input" && H.type === "radio")) {
        F = H
      }
    }
    if (F.nodeType == Node.TEXT_NODE) {
      F = F.parentNode
    }
    return Element.extend(F)
  }

  function p(F, G) {
    var E = C.element(F);
    if (!G) {
      return E
    }
    while (E) {
      if (Object.isElement(E) && Prototype.Selector.match(E, G)) {
        return Element.extend(E)
      }
      E = E.parentNode
    }
  }

  function s(E) {
    return {
      x: c(E),
      y: b(E)
    }
  }

  function c(G) {
    var F = document.documentElement,
      E = document.body || {
        scrollLeft: 0
      };
    return G.pageX || (G.clientX + (F.scrollLeft || E.scrollLeft) - (F.clientLeft || 0))
  }

  function b(G) {
    var F = document.documentElement,
      E = document.body || {
        scrollTop: 0
      };
    return G.pageY || (G.clientY + (F.scrollTop || E.scrollTop) - (F.clientTop || 0))
  }

  function q(E) {
    C.extend(E);
    E.preventDefault();
    E.stopPropagation();
    E.stopped = true
  }
  C.Methods = {
    isLeftClick: v,
    isMiddleClick: t,
    isRightClick: n,
    element: d,
    findElement: p,
    pointer: s,
    pointerX: c,
    pointerY: b,
    stop: q
  };
  var x = Object.keys(C.Methods).inject({}, function(E, F) {
    E[F] = C.Methods[F].methodize();
    return E
  });
  if (window.attachEvent) {
    function i(F) {
      var E;
      switch (F.type) {
        case "mouseover":
        case "mouseenter":
          E = F.fromElement;
          break;
        case "mouseout":
        case "mouseleave":
          E = F.toElement;
          break;
        default:
          return null
      }
      return Element.extend(E)
    }
    var u = {
      stopPropagation: function() {
        this.cancelBubble = true
      },
      preventDefault: function() {
        this.returnValue = false
      },
      inspect: function() {
        return "[object Event]"
      }
    };
    C.extend = function(F, E) {
      if (!F) {
        return false
      }
      if (!a(F)) {
        return F
      }
      if (F._extendedByPrototype) {
        return F
      }
      F._extendedByPrototype = Prototype.emptyFunction;
      var G = C.pointer(F);
      Object.extend(F, {
        target: F.srcElement || E,
        relatedTarget: i(F),
        pageX: G.x,
        pageY: G.y
      });
      Object.extend(F, x);
      Object.extend(F, u);
      return F
    }
  } else {
    C.extend = Prototype.K
  }
  if (window.addEventListener) {
    C.prototype = window.Event.prototype || document.createEvent("HTMLEvents").__proto__;
    Object.extend(C.prototype, x)
  }

  function m(I, H, J) {
    var G = Element.retrieve(I, "prototype_event_registry");
    if (Object.isUndefined(G)) {
      e.push(I);
      G = Element.retrieve(I, "prototype_event_registry", $H())
    }
    var E = G.get(H);
    if (Object.isUndefined(E)) {
      E = [];
      G.set(H, E)
    }
    if (E.pluck("handler").include(J)) {
      return false
    }
    var F;
    if (H.include(":")) {
      F = function(K) {
        if (Object.isUndefined(K.eventName)) {
          return false
        }
        if (K.eventName !== H) {
          return false
        }
        C.extend(K, I);
        J.call(I, K)
      }
    } else {
      if (!D && (H === "mouseenter" || H === "mouseleave")) {
        if (H === "mouseenter" || H === "mouseleave") {
          F = function(L) {
            C.extend(L, I);
            var K = L.relatedTarget;
            while (K && K !== I) {
              try {
                K = K.parentNode
              } catch (M) {
                K = I
              }
            }
            if (K === I) {
              return
            }
            J.call(I, L)
          }
        }
      } else {
        F = function(K) {
          C.extend(K, I);
          J.call(I, K)
        }
      }
    }
    F.handler = J;
    E.push(F);
    return F
  }

  function h() {
    for (var E = 0, F = e.length; E < F; E++) {
      C.stopObserving(e[E]);
      e[E] = null
    }
  }
  var e = [];
  if (Prototype.Browser.IE) {
    window.attachEvent("onunload", h)
  }
  if (Prototype.Browser.WebKit) {
    window.addEventListener("unload", Prototype.emptyFunction, false)
  }
  var l = Prototype.K,
    g = {
      mouseenter: "mouseover",
      mouseleave: "mouseout"
    };
  if (!D) {
    l = function(E) {
      return (g[E] || E)
    }
  }

  function w(H, G, I) {
    H = $(H);
    var F = m(H, G, I);
    if (!F) {
      return H
    }
    if (G.include(":")) {
      if (H.addEventListener) {
        H.addEventListener("dataavailable", F, false)
      } else {
        H.attachEvent("ondataavailable", F);
        H.attachEvent("onlosecapture", F)
      }
    } else {
      var E = l(G);
      if (H.addEventListener) {
        H.addEventListener(E, F, false)
      } else {
        H.attachEvent("on" + E, F)
      }
    }
    return H
  }

  function k(K, H, L) {
    K = $(K);
    var G = Element.retrieve(K, "prototype_event_registry");
    if (!G) {
      return K
    }
    if (!H) {
      G.each(function(N) {
        var M = N.key;
        k(K, M)
      });
      return K
    }
    var I = G.get(H);
    if (!I) {
      return K
    }
    if (!L) {
      I.each(function(M) {
        k(K, H, M.handler)
      });
      return K
    }
    var J = I.length,
      F;
    while (J--) {
      if (I[J].handler === L) {
        F = I[J];
        break
      }
    }
    if (!F) {
      return K
    }
    if (H.include(":")) {
      if (K.removeEventListener) {
        K.removeEventListener("dataavailable", F, false)
      } else {
        K.detachEvent("ondataavailable", F);
        K.detachEvent("onlosecapture", F)
      }
    } else {
      var E = l(H);
      if (K.removeEventListener) {
        K.removeEventListener(E, F, false)
      } else {
        K.detachEvent("on" + E, F)
      }
    }
    G.set(H, I.without(F));
    return K
  }

  function z(H, G, F, E) {
    H = $(H);
    if (Object.isUndefined(E)) {
      E = true
    }
    if (H == document && document.createEvent && !H.dispatchEvent) {
      H = document.documentElement
    }
    var I;
    if (document.createEvent) {
      I = document.createEvent("HTMLEvents");
      I.initEvent("dataavailable", E, true)
    } else {
      I = document.createEventObject();
      I.eventType = E ? "ondataavailable" : "onlosecapture"
    }
    I.eventName = G;
    I.memo = F || {};
    if (document.createEvent) {
      H.dispatchEvent(I)
    } else {
      H.fireEvent(I.eventType, I)
    }
    return C.extend(I)
  }
  C.Handler = Class.create({
    initialize: function(G, F, E, H) {
      this.element = $(G);
      this.eventName = F;
      this.selector = E;
      this.callback = H;
      this.handler = this.handleEvent.bind(this)
    },
    start: function() {
      C.observe(this.element, this.eventName, this.handler);
      return this
    },
    stop: function() {
      C.stopObserving(this.element, this.eventName, this.handler);
      return this
    },
    handleEvent: function(F) {
      var E = C.findElement(F, this.selector);
      if (E) {
        this.callback.call(this.element, F, E)
      }
    }
  });

  function j(G, F, E, H) {
    G = $(G);
    if (Object.isFunction(E) && Object.isUndefined(H)) {
      H = E, E = null
    }
    return new C.Handler(G, F, E, H).start()
  }
  Object.extend(C, C.Methods);
  Object.extend(C, {
    fire: z,
    observe: w,
    stopObserving: k,
    on: j
  });
  Element.addMethods({
    fire: z,
    observe: w,
    stopObserving: k,
    on: j
  });
  Object.extend(document, {
    fire: z.methodize(),
    observe: w.methodize(),
    stopObserving: k.methodize(),
    on: j.methodize(),
    loaded: false
  });
  if (window.Event) {
    Object.extend(window.Event, C)
  } else {
    window.Event = C
  }
})();
(function() {
  var d;

  function a() {
    if (document.loaded) {
      return
    }
    if (d) {
      window.clearTimeout(d)
    }
    document.loaded = true;
    document.fire("dom:loaded")
  }

  function c() {
    if (document.readyState === "complete") {
      document.stopObserving("readystatechange", c);
      a()
    }
  }

  function b() {
    try {
      document.documentElement.doScroll("left")
    } catch (f) {
      d = b.defer();
      return
    }
    a()
  }
  if (document.addEventListener) {
    document.addEventListener("DOMContentLoaded", a, false)
  } else {
    document.observe("readystatechange", c);
    if (window == top) {
      d = b.defer()
    }
  }
  Event.observe(window, "load", a)
})();
Element.addMethods();
Hash.toQueryString = Object.toQueryString;
var Toggle = {
  display: Element.toggle
};
Element.Methods.childOf = Element.Methods.descendantOf;
var Insertion = {
  Before: function(a, b) {
    return Element.insert(a, {
      before: b
    })
  },
  Top: function(a, b) {
    return Element.insert(a, {
      top: b
    })
  },
  Bottom: function(a, b) {
    return Element.insert(a, {
      bottom: b
    })
  },
  After: function(a, b) {
    return Element.insert(a, {
      after: b
    })
  }
};
var $continue = new Error('"throw $continue" is deprecated, use "return" instead');
var Position = {
  includeScrollOffsets: false,
  prepare: function() {
    this.deltaX = window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0;
    this.deltaY = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
  },
  within: function(b, a, c) {
    if (this.includeScrollOffsets) {
      return this.withinIncludingScrolloffsets(b, a, c)
    }
    this.xcomp = a;
    this.ycomp = c;
    this.offset = Element.cumulativeOffset(b);
    return (c >= this.offset[1] && c < this.offset[1] + b.offsetHeight && a >= this.offset[0] && a < this.offset[0] + b.offsetWidth)
  },
  withinIncludingScrolloffsets: function(b, a, d) {
    var c = Element.cumulativeScrollOffset(b);
    this.xcomp = a + c[0] - this.deltaX;
    this.ycomp = d + c[1] - this.deltaY;
    this.offset = Element.cumulativeOffset(b);
    return (this.ycomp >= this.offset[1] && this.ycomp < this.offset[1] + b.offsetHeight && this.xcomp >= this.offset[0] && this.xcomp < this.offset[0] + b.offsetWidth)
  },
  overlap: function(b, a) {
    if (!b) {
      return 0
    }
    if (b == "vertical") {
      return ((this.offset[1] + a.offsetHeight) - this.ycomp) / a.offsetHeight
    }
    if (b == "horizontal") {
      return ((this.offset[0] + a.offsetWidth) - this.xcomp) / a.offsetWidth
    }
  },
  cumulativeOffset: Element.Methods.cumulativeOffset,
  positionedOffset: Element.Methods.positionedOffset,
  absolutize: function(a) {
    Position.prepare();
    return Element.absolutize(a)
  },
  relativize: function(a) {
    Position.prepare();
    return Element.relativize(a)
  },
  realOffset: Element.Methods.cumulativeScrollOffset,
  offsetParent: Element.Methods.getOffsetParent,
  page: Element.Methods.viewportOffset,
  clone: function(b, c, a) {
    a = a || {};
    return Element.clonePosition(c, b, a)
  }
};
if (!document.getElementsByClassName) {
  document.getElementsByClassName = function(b) {
    function a(c) {
      return c.blank() ? null : "[contains(concat(' ', @class, ' '), ' " + c + " ')]"
    }
    b.getElementsByClassName = Prototype.BrowserFeatures.XPath ? function(c, e) {
      e = e.toString().strip();
      var d = /\s/.test(e) ? $w(e).map(a).join("") : a(e);
      return d ? document._getElementsByXPath(".//*" + d, c) : []
    } : function(e, f) {
      f = f.toString().strip();
      var g = [],
        h = (/\s/.test(f) ? $w(f) : null);
      if (!h && !f) {
        return g
      }
      var c = $(e).getElementsByTagName("*");
      f = " " + f + " ";
      for (var d = 0, k, j; k = c[d]; d++) {
        if (k.className && (j = " " + k.className + " ") && (j.include(f) || (h && h.all(function(i) {
            return !i.toString().blank() && j.include(" " + i + " ")
          })))) {
          g.push(Element.extend(k))
        }
      }
      return g
    };
    return function(d, c) {
      return $(c || document.body).getElementsByClassName(d)
    }
  }(Element.Methods)
}
Element.ClassNames = Class.create();
Element.ClassNames.prototype = {
  initialize: function(a) {
    this.element = $(a)
  },
  _each: function(a) {
    this.element.className.split(/\s+/).select(function(b) {
      return b.length > 0
    })._each(a)
  },
  set: function(a) {
    this.element.className = a
  },
  add: function(a) {
    if (this.include(a)) {
      return
    }
    this.set($A(this).concat(a).join(" "))
  },
  remove: function(a) {
    if (!this.include(a)) {
      return
    }
    this.set($A(this).without(a).join(" "))
  },
  toString: function() {
    return $A(this).join(" ")
  }
};
Object.extend(Element.ClassNames.prototype, Enumerable);
(function() {
  window.Selector = Class.create({
    initialize: function(a) {
      this.expression = a.strip()
    },
    findElements: function(a) {
      return Prototype.Selector.select(this.expression, a)
    },
    match: function(a) {
      return Prototype.Selector.match(a, this.expression)
    },
    toString: function() {
      return this.expression
    },
    inspect: function() {
      return "#<Selector: " + this.expression + ">"
    }
  });
  Object.extend(Selector, {
    matchElements: function(f, g) {
      var a = Prototype.Selector.match,
        d = [];
      for (var c = 0, e = f.length; c < e; c++) {
        var b = f[c];
        if (a(b, g)) {
          d.push(Element.extend(b))
        }
      }
      return d
    },
    findElement: function(f, g, b) {
      b = b || 0;
      var a = 0,
        d;
      for (var c = 0, e = f.length; c < e; c++) {
        d = f[c];
        if (Prototype.Selector.match(d, g) && b === a++) {
          return Element.extend(d)
        }
      }
    },
    findChildElements: function(b, c) {
      var a = c.toArray().join(", ");
      return Prototype.Selector.select(a, b || document)
    }
  })
})();
/*! RESOURCE: /scripts/doctype/functions_bootstrap14.js */
var userAgentLowerCase = navigator.userAgent.toLowerCase();
var isMSIE = userAgentLowerCase.indexOf("msie") >= 0;
var ie5 = false;
var isMSIE6 = false
var isMSIE7 = false;
var isMSIE8 = false;
var isMSIE9 = userAgentLowerCase.indexOf("msie 9") >= 0;
var isMSIE10 = userAgentLowerCase.indexOf("msie 10") >= 0;
var isMSIE11 = userAgentLowerCase.indexOf("rv:11.0") > 0;
var isChrome = userAgentLowerCase.indexOf("chrome") >= 0;
var isFirefox = userAgentLowerCase.indexOf("firefox") >= 0;
var isSafari = !isChrome && (userAgentLowerCase.indexOf("safari") >= 0);
var isSafari5 = false;
if (isSafari) {
  try {
    var reSafariVersion = new RegExp("version/([\\d\\.]{3,5}) safari/");
    var results = reSafariVersion.exec(userAgentLowerCase);
    if (results.length > 0) {
      var reMajor = new RegExp("([\\d]).");
      var results = reMajor.exec(results[1]);
      if (results.length > 0) {
        var mv = parseInt(results[1]);
        isSafari5 = mv < 6;
      }
    }
  } catch (e) {}
}
var isMacintosh = userAgentLowerCase.indexOf("macintosh") >= 0;
var isWebKit = navigator.userAgent.indexOf("WebKit") >= 0;
var isTouchDevice = navigator.userAgent.indexOf('iPhone') > -1 || navigator.userAgent.indexOf('iPad') > -1;
var GJSV = 1.0;
(function() {
  var defined = {};
  var waiting = {};

  function listen(id, then) {
    if (typeof id !== 'string')
      listenMany(id, then);
    if (defined[id]) {
      return then(defined[id]);
    }
    if (!waiting[id]) {
      waiting[id] = [];
    }
    waiting[id].push(then);
  }

  function emit(id, data) {
    defined[id] = data;
    var listeners = waiting[id];
    if (!listeners) {
      return;
    }
    for (var i = 0, l = listeners.length; i < l; i++) {
      listeners[i](data);
    }
    waiting[id] = [];
  }

  function listenMany(dependencies, then) {
    if (typeof dependencies.length === 'undefined') {
      return;
    }
    var unDef = {
      isUndefined: true
    };
    var resolved = [];

    function resolve(dep, i) {
      resolved[i] = dep;
      for (var i = 0, l = resolved.length; i < l; i++) {
        if (resolved[i] === unDef)
          return;
      }
      then.apply(undefined, resolved);
    };
    dependencies.forEach(function(depId, idx) {
      resolved[idx] = unDef;
      listen(depId, function(dep) {
        resolve(dep, idx);
      });
    });
  }
  window.CachedEvent = {
    after: listen,
    emit: emit
  };
})();
var g_afterPageLoadedFunctions = [];
window.g_render_functions = window.g_render_functions || [];
window.g_load_functions = window.g_load_functions || [];
window.g_late_load_functions = window.g_late_load_functions || [];

function runBeforeRender() {
  _runInlineScripts();
  jslog("runBeforeRender");
  for (var i = 0; i != g_render_functions.length; i++) {
    var f = g_render_functions[i];
    f.call();
  }
}

function _runInlineScripts() {
  var inlineScripts = $j('script[type="application/javascript-deferred"]');
  jslog("running inline scripts, count: " + inlineScripts.length);
  inlineScripts.each(function(index, item) {
    var script = $j(item).text();
    try {
      $j.globalEval(script);
    } catch (e) {
      jslog("error in script " + script);
    }
  });
}
window.g_hasRunAfterAllLoaded = false;

function runAfterAllLoaded() {
  if (g_hasRunAfterAllLoaded) {
    jslog("Redundant call to runAfterAllLoaded");
    return;
  }
  g_hasRunAfterAllLoaded = true;
  var sw = new StopWatch();
  jslog("runAfterAllLoaded, functions: " + g_load_functions.length);
  for (var i = 0; i != g_load_functions.length; i++) {
    var f = g_load_functions[i];
    var t = new Date().getTime();
    f.call();
    t = new Date().getTime() - t;
    if (t > 5000)
      jslog("Time: " + t + " for: [" + i + "] " + f);
  }
  jslog("late load functions: " + g_late_load_functions.length);
  for (var i = 0; i != g_late_load_functions.length; i++) {
    var f = g_late_load_functions[i];
    f.call();
  }
  window.self.loaded = true;
  sw.jslog("runAfterAllLoaded finished");
}

function addLoadEvent(func) {
  if (window.self.loaded) {
    setTimeout(func, 0);
    return;
  }
  g_load_functions.push(func);
}

function addLateLoadEvent(func) {
  if (window.self.loaded) {
    setTimeout(func, 0);
    return;
  }
  g_late_load_functions.push(func);
}

function pageLoaded() {
  CustomEvent.observe("body_clicked", contextMenuHide);
  setMandatoryExplained.defer();
}

function addRenderEvent(func) {
  if (isRenderEventRegistered(func))
    return;
  addRenderEventToArray(func);
}

function addRenderEventToArray(func) {
  if (window.self.loaded) {
    setTimeout(func, 0);
    return;
  }
  g_render_functions.push(func);
}

function isRenderEventRegistered(func) {
  var s = func.toString();
  for (var i = 0; i < g_render_functions.length; i++)
    if (g_render_functions[i].toString() == s)
      return true;
  return false;
}

function addRenderEventLogged(func, name, funcname) {
  addRenderEventToArray(function() {
    CustomEvent.fire('glide_optics_inspect_put_cs_context', funcname, 'load');
    var sw = new StopWatch();
    var __rtmr = new Date();
    try {
      func();
    } catch (e) {
      jslog('***************************************************');
      jslog('A script has encountered an error in render events');
      jslog(e.toString());
      jslog('Script ends. Continuing happily');
      jslog('***************************************************');
    }
    CustomEvent.fire('page_timing', {
      name: 'CSOL',
      child: {
        description: name.substr(7),
        sys_id: g_event_handler_ids[funcname],
        source_table: 'sys_script_client'
      },
      startTime: __rtmr,
      win: window
    });
    sw.jslog(name);
    CustomEvent.fire('glide_optics_inspect_pop_cs_context', funcname, 'load');
  });
}

function addTopRenderEvent(func) {
  if (window.self.loaded) {
    setTimeout(func, 0);
    return;
  }
  g_render_functions.unshift(func);
}

function addAfterPageLoadedEvent(func) {
  if (window.self.loaded) {
    setTimeout(func, 0);
    return;
  }
  g_afterPageLoadedFunctions.push(func);
}

function runAfterPageLoadedEvents() {
  jslog("after page loaded starting");
  var sw = new StopWatch();
  for (var i = 0; i != g_afterPageLoadedFunctions.length; i++) {
    var f = g_afterPageLoadedFunctions[i];
    f.call();
  }
  sw.jslog("after page loaded complete, functions called: " + g_afterPageLoadedFunctions.length);
  g_afterPageLoadedFunctions = [];
}
addLateLoadEvent(function() {
  setTimeout(runAfterPageLoadedEvents, 30);
});

function addUnloadEvent(func) {
  Event.observe(window, 'unload', func, false);
}

function addTinymceLoadEvent(id, func) {
  CachedEvent.after('tinyeditor_init.' + id, func);
}

function fireTinymceLoadEvent(id, ed) {
  CachedEvent.emit('tinyeditor_init.' + id, ed);
}

function gel(id) {
  if (typeof id != 'string')
    return id;
  return document.getElementById(id);
}

function cel(name, parent) {
  var e = document.createElement(name);
  if (arguments.length > 1)
    parent.appendChild(e);
  return e;
}

function rel(id) {
  var e = gel(id);
  if (e)
    e.parentNode.removeChild(e);
}

function addChild(element) {
  getFormContentParent().appendChild(element);
}

function inner(id, data) {
  var el = gel(id);
  if (el != null)
    el.innerHTML = data;
}

function clearNodes(t) {
  if (!t)
    return;
  while (t.hasChildNodes())
    t.removeChild(t.childNodes[0]);
}

function getTopWindow() {
  var topWindow = window.self;
  try {
    while (topWindow.GJSV && topWindow != topWindow.parent && topWindow.parent.GJSV) {
      topWindow = topWindow.parent;
    }
  } catch (e) {}
  return topWindow;
}

function inFrame() {
  return getTopWindow() != window.self;
}

function getMainWindow() {
  var topWindow = getTopWindow();
  return topWindow['gsft_main'];
}

function getMainFormWindow() {
  var topWindow = getTopWindow();
  return topWindow['gsft_main_form'];
}

function getNavWindow() {
  var topWindow = getTopWindow();
  return topWindow['gsft_nav'];
}

function reloadWindow(win) {
  var href = win.location.href;
  var len = href.length;
  if (win.frames['iframe_live_feed'] && href.endsWith('#') && len > 2)
    href = href.substring(0, len - 2)
  href = addDomainParameters(href);
  win.location.href = href;
}

function addDomainParameters(href) {
  var url = new GlideURL(href);
  if (url.getParam('sysparm_domain') == 'picker') {
    url.deleteParam('sysparm_domain');
  } else {
    var domainElement = gel('sysparm_domain');
    if (domainElement) {
      if (domainElement.value != 'picker') {
        url.addParam('sysparm_domain', domainElement.value);
        var domainScope = gel('sysparm_domain_scope');
        if (domainScope) {
          url.addParam('sysparm_domain_scope', domainScope.value);
        }
      }
    }
  }
  url.addParam('sysparm_nostack', 'true');
  url.setEncode(false);
  return url.getURL();
}

function addOnSubmitEvent(form, func, funcname) {
  if (!form)
    return;
  var oldonsubmit = form.onsubmit;
  if (typeof form.onsubmit != 'function')
    form.onsubmit = func;
  else {
    form.onsubmit = function() {
      var formFuncCalled = false;
      try {
        if (oldonsubmit() == false)
          return false;
        CustomEvent.fire('glide_optics_inspect_put_cs_context', funcname, 'submit');
        formFuncCalled = true;
        var returnvalue = func();
        formFuncCalled = false;
        CustomEvent.fire('glide_optics_inspect_pop_cs_context', funcname, 'submit');
        if (returnvalue == false)
          return false;
        return true;
      } catch (ex) {
        if (formFuncCalled)
          CustomEvent.fire('glide_optics_inspect_pop_cs_context', funcname, 'load');
        formFuncError("onSubmit", func, ex);
        return false;
      }
    }
  }
  form = null;
}

function formFuncError(type, func, ex) {
  var funcStr = func.toString();
  funcStr = funcStr.replace(/onSubmit[a-fA-F0-9]{32}\(/, "onSubmit(");
  var msg;
  if (g_user.hasRole("client_script_admin"))
    msg = type + " script error: " + ex.toString() + ":<br/>" + funcStr.replace(/\n/g, "<br/>").replace(/\s/g, "&nbsp;");
  else
    msg = "Submit canceled due to a script error - please contact your System Administrator";
  g_form.addErrorMessage(msg);
}

function hide(element) {
  var e = typeof element === "string" ? gel(element) : element;
  if (!e)
    return;
  e.style.display = 'none';
  _frameChanged();
}

function show(element) {
  var e = typeof element === "string" ? gel(element) : element;
  if (!e)
    return;
  if (e.tagName == "TR")
    e.style.display = 'table-row';
  else
    e.style.display = 'block';
  _frameChanged();
}

function hideObject(o, visibilityOnly) {
  if (!o)
    return;
  o.style.visibility = "hidden";
  if (!visibilityOnly)
    o.style.display = "none";
  _frameChanged();
}

function showObject(o, visibilityOnly) {
  if (!o)
    return;
  o.style.visibility = "visible";
  if (!visibilityOnly)
    o.style.display = "block";
  _frameChanged();
}

function showObjectInline(o) {
  if (!o)
    return;
  o.style.visibility = "visible";
  o.style.display = "inline";
  _frameChanged();
}

function showObjectInlineBlock(o) {
  if (!o)
    return;
  o.style.visibility = "visible";
  o.style.display = "inline-block";
  _frameChanged();
}

function focusFirstElement(form) {
  try {
    var e = findFirstEditableElement(form);
    if (e) {
      Field.activate(e);
      triggerEvent(e, 'focus', true);
    }
  } catch (ex) {}
}

function findFirstEditableElement(form) {
  var tags = ['input', 'select', 'textarea'];
  var elements = form.getElementsByTagName('*');
  for (var i = 0, n = elements.length; i < n; i++) {
    var element = elements[i];
    if (element.type == 'hidden')
      continue;
    var tagName = element.tagName.toLowerCase();
    if (!tags.include(tagName))
      continue;
    element = $(element);
    var formGroup = element.up('.form-group');
    if (!element.disabled &&
      !element.readOnly &&
      element.style.visibility != 'hidden' &&
      element.style.display != 'none' &&
      element.offsetParent != null &&
      formGroup &&
      formGroup.style.display != 'none')
      return element;
  }
  return null;
}

function triggerEvent(element, eventType, canBubble) {
  canBubble = (typeof(canBubble) == undefined) ? true : canBubble;
  if (element && element.disabled && eventType == "change" && element.onchange) {
    element.onchange.call(element);
    return;
  }
  if (element.fireEvent) {
    element.fireEvent('on' + eventType);
  } else {
    var evt = document.createEvent('HTMLEvents');
    evt.initEvent(eventType, canBubble, true);
    element.dispatchEvent(evt);
  }
}
var g_form_dirty_message;

function onWindowClose() {
  if (typeof g_form == 'undefined')
    return;
  if (!g_form.submitted && g_form.modified) {
    g_submitted = false;
    setTimeout(function() {
      CustomEvent.fireTop('glide:nav_form_dirty_cancel_stay', window);
    }, 750);
    return g_form_dirty_message;
  }
  g_form.submitted = false;
}

function jslog(msg, src, dateTime) {
  try {
    if (!src) {
      var path = window.self.location.pathname;
      src = path.substring(path.lastIndexOf('/') + 1);
    }
    if (window.self.opener && window != window.self.opener) {
      if (window.self.opener.jslog) {
        window.self.opener.jslog(msg, src, dateTime);
      }
    } else if (parent && parent.jslog && jslog != parent.jslog) {
      parent.jslog(msg, src, dateTime);
    } else if (parent.parent && parent.parent.jslog && jslog != parent.parent.jslog) {
      parent.parent.jslog(msg, src, dateTime);
    } else {
      if (window.console && window.console.log)
        console.log(msg);
    }
  } catch (e) {}
}

function getXMLIsland(name) {
  var xml = gel(name);
  if (xml == null)
    return null;
  xml = "<xml>" + xml.innerHTML + "</xml>";
  xml = loadXML(xml);
  return xml;
}

function lock(me, ref, edit_id, nonedit_id, current_value_id, update_id) {
  if (me)
    me.style.display = "none";
  var unlock = gel(ref + '_unlock');
  unlock.style.display = "";
  var edit_span = gel(edit_id);
  edit_span.style.display = "none";
  var nonedit_span = gel(nonedit_id);
  nonedit_span.style.display = "inline-block";
  var current_value = gel(current_value_id);
  var the_value = "";
  if (current_value.options) {
    for (var i = 0; i < current_value.options.length; i++) {
      if (i > 0)
        the_value += g_glide_list_separator;
      the_value += current_value.options[i].text;
    }
  } else
    the_value = current_value.value;
  var update_element = gel(update_id);
  if (update_element.href)
    update_element.href = the_value;
  update_element.innerHTML = htmlEscape(the_value);
}

function unlock(me, ref, edit_id, nonedit_id) {
  if (me)
    me.style.display = "none";
  var unlock = gel(ref + '_lock');
  if (unlock)
    showObjectInlineBlock(unlock);
  var edit_span = gel(edit_id);
  edit_span.style.display = "";
  var nonedit_span = gel(nonedit_id);
  nonedit_span.style.display = "none";
  var list_foc = gel("sys_display." + ref);
  if (list_foc) {
    try {
      list_foc.focus();
    } catch (e) {}
  }
}

function setMandatoryExplained(enforce) {
  var showexp = gel('mandatory_explained');
  if (!showexp)
    return;
  if (enforce || foundAMandatoryField())
    showexp.style.display = "inline";
  else
    showexp.style.display = "none";
}

function foundAMandatoryField() {
  var spanTags = document.getElementsByTagName('span');
  if (!spanTags)
    return false;
  for (var c = 0, n = spanTags.length; c != n; ++c) {
    var spanTag = spanTags[c];
    var id = spanTag.id;
    if (!id)
      continue;
    if (id.indexOf('status.') == 0) {
      var mandatory = spanTag.getAttribute("mandatory") + "";
      if (mandatory == 'true')
        return true;
    }
  }
  return false;
}
var _frameChangedTimer = null;

function _frameChanged() {
  if (_frameChangedTimer)
    clearTimeout(_frameChangedTimer);
  _frameChangedTimer = setTimeout(function() {
    _frameChangedTimer = null;
    CustomEvent.fire('frame.resized');
    CustomEvent.fire('refresh.event');
  }, 300);
}

function getFormContentParent() {
  var glideOverlay = $(document.body).select("div.glide_overlay");
  var exposeMask = $('glide_expose_mask');
  if (glideOverlay.length > 0 && exposeMask && exposeMask.visible())
    return glideOverlay[0];
  if (typeof g_section_contents == 'undefined' || !g_section_contents)
    g_section_contents = $(document.body).select(".section_header_content_no_scroll");
  if (g_section_contents.length > 0)
    return g_section_contents[0];
  return document.body;
}

function addClassName(element, name) {
  if (!element)
    return;
  $(element).addClassName(name);
}

function removeClassName(element, name) {
  if (!element)
    return;
  $(element).removeClassName(name);
}

function hasClassName(element, name) {
  if (!element)
    return;
  if (!element.hasClassName)
    return;
  return $(element).hasClassName(name);
}

function getIFrameDocument(iframe) {
  return iframe.contentWindow ? iframe.contentWindow.document : (iframe.contentDocument || null);
}

function writeTitle(element, title) {
  element.title = title;
  if (element.alt)
    element.alt = title;
}

function contextMenuHide(e) {
  if (typeof contextHide === 'undefined')
    return;
  if (!isMSIE && e) {
    if (isTouchDevice && !isTouchRightClick(e)) {
      if (e.type == 'touchend' && $(e.target).up('.context_menu'))
        return;
      contextHide();
    } else if (isLeftClick(e)) {
      contextHide();
    }
  } else
    contextHide();
}

function trim(s) {
  return s.replace(/^\s+|\s+$/g, '');
}

function htmlEscape(s) {
  return s.replace(/&/g, "&amp;").replace(/'/g, "&#39;").replace(/"/g,
    "&quot;").replace(/</g, "&#60;").replace(/>/g, "&#62;");
}

function htmlEscapeQuote(s) {
  return s.replace(/'/g, "&#39;");
}

function htmlEscapeDoubleQuote(s) {
  return s.replace(/"/g, "&quot;");
}

function loadXML(r) {
  var xml = r.responseXML;
  if (typeof xml != 'undefined')
    return xml;
  var dom = null;
  try {
    dom = new DOMParser().parseFromString(r, 'text/xml');
  } catch (e) {}
  return dom;
}
if (!window.GwtDateTimePicker) {
  window.GwtDateTimePicker = function(name, format, showTime) {
    ScriptLoader.getScripts('scripts/classes/GwtDateTimePicker.js', function() {
      new GwtDateTimePicker(name, format, showTime);
    });
  }
};
/*! RESOURCE: /scripts/doctype/functions.js */
function isDoctype() {
  return true;
}

function gsftSubmit(control, form, action_name) {
  var f;
  if (typeof form == "undefined") {
    f = findParentByTag(control, 'form');
    if (typeof form == "undefined") {
      var sectionFormId = $("section_form_id");
      if (sectionFormId)
        f = $(sectionFormId.value);
    }
  } else
    f = form;
  if (g_submitted)
    return false;
  if (typeof action_name == "undefined" && control)
    action_name = control.id;
  if (action_name == 'sysverb_delete') {
    if (!confirm(getMessage("Delete this record") + "?")) {
      g_submitted = false;
      return false;
    }
  }
  f.sys_action.value = action_name;
  if (typeof f.onsubmit == "function" && action_name != 'sysverb_back') {
    var rc = f.onsubmit();
    if (rc === false) {
      g_submitted = g_form.submitted = false;
      return false;
    }
  }
  if (control && control.getAttribute('gsft_id')) {
    action_name = control.getAttribute('gsft_id');
    f.sys_action.value = action_name;
  }
  if (action_name == 'sysverb_back')
    g_submitted = false;
  else
    g_submitted = true;
  if (typeof g_form != 'undefined' && g_form && g_submitted)
    g_form.enableUIPolicyFields();
  CustomEvent.fire("glide:form_submitted");
  try {
    GlideAjax.disableSessionMessages();
    f.submit();
  } catch (ex) {
    GlideAjax.enableSessionMessages();
    if (ex.message.indexOf('Unspecified') == -1)
      throw ex;
  }
  return false;
}

function setCheckBox(box) {
  var name = box.name;
  var id = name.substring(3);
  var frm = box.form;
  if (frm)
    frm[id].value = box.checked;
  else {
    var widget = $(id);
    if (widget)
      widget.value = box.checked;
  }
  if (box['onchange'])
    box.onchange();
}

function populateParmQuery(form, prefix, defaultNULL, action) {
  var keys = ['No records selected', 'Delete the selected item?', 'Delete these', 'items?'];
  var msgs = getMessages(keys);
  var keyset = getChecked(form);
  if (!action)
    action = form.sys_action.value;
  if (action.indexOf("sysverb") != 0) {
    if (keyset == '') {
      if (!alert(msgs["No records selected"]))
        return false;
    } else {
      if (action == "delete_checked") {
        var items = keyset.split(",");
        if (items.length == 1) {
          if (!confirm(msgs["Delete the selected item?"]))
            return false;
        } else if (items.length > 0) {
          if (!confirm(msgs["Delete these"] + " " + items.length + " " + msgs["items?"]))
            return false;
        }
      }
    }
  } else if (form.sys_action.value == "sysverb_new") {
    addInput(form, 'HIDDEN', 'sys_id', '-1');
  }
  if (keyset == '' && defaultNULL)
    keyset = defaultNULL;
  if (prefix)
    keyset = prefix + keyset;
  addInput(form, 'HIDDEN', 'sysparm_checked_items', keyset);
  return true;
}

function getChecked(form) {
  var keyset = '';
  var lookup = form;
  for (i = 0; i < lookup.elements.length; i++) {
    if (lookup.elements[i].type != "checkbox")
      continue;
    var v = lookup.elements[i];
    if (v.checked) {
      var id = v.id.substring(3);
      var skip = v.name.substring(0, 4);
      if (skip == "SKIP")
        continue;
      if (id == "all")
        continue;
      if (keyset == '')
        keyset = id;
      else
        keyset = keyset + ',' + id;
    }
  }
  return keyset;
}

function iterateList(e, row, value, update) {
  update = (typeof update === 'undefined') ? true : update;
  if (update)
    g_form.setMandatoryOnlyIfModified(true);
  var form = g_form.getFormElement();
  form.sys_action.value = value;
  var query = e.getAttribute("query");
  addInput(form, 'HIDDEN', 'sys_record_row', row);
  addInput(form, 'HIDDEN', 'sys_record_list', query);
  if (update && typeof form.onsubmit == "function") {
    var rc = form.onsubmit();
    if (!rc) {
      g_submitted = false;
      return false;
    }
  }
  try {
    form.submit();
  } catch (ex) {
    if (ex.message.indexOf('Unspecified') == -1)
      throw ex;
  }
  return false;
}

function refreshNav() {
  CustomEvent.fireTop('navigator.refresh');
}

function checkSave(tableName, urlBase, idField, refKey) {
  var sysid = document.getElementsByName(idField)[0].value;
  checkSaveID(tableName, urlBase, sysid, refKey);
}

function checkSaveID(tableName, urlBase, sysid, refKey) {
  sysid = trim(sysid);
  var url = urlBase + "?sys_id=" + sysid;
  if (refKey)
    url += "&sysparm_refkey=" + refKey;
  var view = $('sysparm_view');
  if (view != null) {
    view = view.value;
    if (view != '')
      url += "&sysparm_view=" + view;
  }
  var nameOfStack = $('sysparm_nameofstack');
  if (nameOfStack != null) {
    nameOfStack = nameOfStack.value;
    if (nameOfStack != '')
      url += "&sysparm_nameofstack=" + nameOfStack;
  }
  if (typeof GlideTransactionScope != 'undefined') {
    GlideTransactionScope.appendTransactionScope(function(name, value) {
      url += "&" + name + "=" + value;
    });
  }
  return checkSaveURL(tableName, url);
}

function checkSaveURL(tableName, url) {
  if (g_submitted)
    return false;
  var f = document.getElementById(tableName + ".do");
  if (g_form.getTableName() == tableName) {
    var fs = document.forms;
    for (var z = 0; z < fs.length; z++) {
      if (typeof fs[z].sys_uniqueValue != 'undefined') {
        f = fs[z];
        break;
      }
    }
  }
  if (!g_form.isNewRecord())
    g_form.setMandatoryOnlyIfModified(true);
  f.sys_action.value = 'sysverb_check_save';
  addInput(f, 'HIDDEN', 'sysparm_goto_url', url);
  if (typeof f.onsubmit == "function") {
    var rc = f.onsubmit();
    if (!rc) {
      g_submitted = false;
      return false;
    }
  }
  g_submitted = true;
  if (typeof g_form != 'undefined' && g_form)
    g_form.enableUIPolicyFields();
  f.submit();
  return false;
}

function submitTextSearch(event, tableName) {
  if (event != true && event.keyCode != 13)
    return;
  var form = getControlForm(tableName);
  addHidden(form, 'sysverb_textsearch', form['sys_searchtext'].value);
  addHidden(form, 'sysparm_query', '');
  addHidden(form, 'sysparm_referring_url', '');
  form.submit();
}

function getControlForm(name) {
  var form = document.forms[name + '_control'];
  if (isSafari || isChrome) {
    if (form) {
      var collectionType = form.toString();
      if (collectionType != "[object HTMLFormElement]")
        form = form[0];
    }
  }
  return form;
}

function getFormForList(listId) {
  return $(listId + "_control");
}

function getFormForElement(element) {
  var f = element.form;
  if (f)
    return f;
  return findParentByTag(element, "form");
}

function hideReveal(sectionName, imagePrefix, snap) {
  var el = $(sectionName);
  if (!el)
    return;
  var $s = $j('#section-' + sectionName);
  if ($s.length == 0)
    return _hideRevealDirect(sectionName, imagePrefix, snap);
  var $b = $j(".section-content", $s);
  if ($s.hasClass("state-closed"))
    $b.show("medium");
  else
    $b.hide("medium");
  $s.toggleClass('state-closed');
  setPreference("collapse.section." + sectionName, $s.hasClass('state-closed') ? "true" : "false");
}

function _hideRevealDirect(sectionName, imagePrefix, snap) {
  var el = $(sectionName);
  if (!el)
    return;
  var img = $("img." + sectionName);
  var imageName = "section";
  if (imagePrefix)
    imageName = imagePrefix;
  if (el.style.display == "block") {
    hide(el);
    if (img) {
      img.src = "images/" + imageName + "_hide.gifx";
      img.alt = getMessage("Display / Hide");
    }
  } else {
    show(el);
    if (img) {
      img.src = "images/" + imageName + "_reveal.gifx";
      img.alt = getMessage("Display / Hide");
    }
  }
}

function hideRevealWithTitle(name, hideMsg, showMsg) {
  var el = $(name);
  if (!el)
    return;
  var img = $("img." + name);
  if (el.style.display == "block") {
    el.style.display = "none";
    img.src = "images/section_hide.gifx"
    img.title = showMsg;
    img.alt = showMsg;
  } else {
    el.style.display = "block";
    img.src = "images/section_reveal.gifx"
    img.title = hideMsg;
    img.alt = hideMsg;
  }
}

function forceHideWithTitle(name, msg) {
  var el = $(name);
  if (!el)
    return;
  var img = $("img." + name);
  el.style.display = "none";
  img.src = "images/section_hide.gifx"
  img.title = msg;
  img.alt = msg;
}

function forceHide(sectionName) {
  var el = $(sectionName);
  if (!el)
    return;
  var img = $("img." + sectionName);
  el.style.display = "none";
  img.src = "images/section_hide.gifx";
  img.alt = getMessage("Collapse");
}

function forceReveal(sectionName, sectionNameStarts, tagName) {
  var els = $$(tagName);
  if (els) {
    for (var c = 0; c < els.length; ++c) {
      if (els[c].id.indexOf(sectionNameStarts) == 0) {
        forceHide(els[c].id);
      }
    }
  }
  var el = $(sectionName);
  if (!el)
    return;
  var img = $("img." + sectionName);
  el.style.display = "block";
  img.src = "images/section_reveal.gif";
  img.alt = getMessage("Expand");
  window.location = '#' + sectionName;
}

function insertAtCursor(textField, value) {
  if (document.selection) {
    textField.focus();
    sel = document.selection.createRange();
    sel.text = value;
  } else if (textField.selectionStart || textField.selectionStart == 0) {
    var startPos = textField.selectionStart;
    var endPos = textField.selectionEnd;
    textField.value = textField.value.substring(0, startPos) + value +
      textField.value.substring(endPos, textField.value.length);
  } else {
    textField.value += value;
  }
}

function insertScriptVar(textBoxName, selectBoxName) {
  var textBox = $(textBoxName);
  var select = $(selectBoxName);
  var options = select.options;
  for (var i = 0; i != select.length; i++) {
    var option = options[i];
    if (!option.selected)
      continue;
    var label = option.text;
    var v = option.value.split('.');
    v = 'current.' + v[1];
    insertAtCursor(textBox, v);
  }
}

function fieldTyped(me) {
  formChangeKeepAlive();
}

function setPreference(name, value, func) {
  var u = getActiveUser();
  if (u)
    u.setPreference(name, value);
  var url = new GlideAjax("UserPreference");
  url.addParam("sysparm_type", "set");
  url.addParam("sysparm_name", name);
  url.addParam("sysparm_value", value);
  url.getXML(func);
}

function deletePreference(name) {
  var u = getActiveUser();
  if (u)
    u.deletePreference(name);
  var url = new GlideAjax("UserPreference");
  url.addParam("sysparm_type", "delete");
  url.addParam("sysparm_name", name);
  url.getXML(doNothing);
}

function getPreference(name) {
  var u = getActiveUser();
  if (u) {
    var opinion = u.getPreference(name);
    if (typeof opinion != 'undefined')
      return opinion;
  }
  var url = new GlideAjax("UserPreference");
  url.addParam("sysparm_type", "get");
  url.addParam("sysparm_name", name);
  var xml = url.getXMLWait();
  if (!xml)
    return '';
  var items = xml.getElementsByTagName("item");
  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    var value = item.getAttribute("value");
    if (u)
      u.setPreference(name, value);
    return value;
  }
  return '';
}

function getActiveUser() {
  return getTopWindow().g_active_user || window.g_user;
}

function labelClicked(label, elementType) {
  var hFor = label.htmlFor;
  if (hFor) {
    var elpaco = $("sys_display." + hFor);
    if (!elpaco || elpaco.type == "hidden")
      elpaco = $(hFor);
    if (elpaco && elpaco.type != "hidden" && elpaco.style.visibility != "hidden") {
      if (elpaco.disabled != true)
        if (elementType == "html" || elementType == "translated_html") {
          var handler = g_form.elementHandlers[hFor];
          if (handler)
            handler.focusEditor();
        } else
          elpaco.focus();
    }
  }
  return false;
}

function insertFieldName(textBoxName, label) {
  var textBox = $(textBoxName);
  var index = label.indexOf(":");
  if (index > -1)
    insertAtCursor(textBox, "\n" + label);
  else
    insertAtCursor(textBox, label);
  var form = textBox.up('form');
  if (form) {
    var onChangeData = {
      id: textBox.id,
      value: textBox.value,
      modified: true
    };
    form.fire('glideform:onchange', onChangeData);
  }
}

function replaceRegEx(text, doc, tableName) {
  var s = "";
  var re = new RegExp("%\\{\\w+[\\}]");
  var m = re.exec(text);
  if (m != null) {
    for (i = 0; i < m.length; i++) {
      s = s + m[i];
    }
  }
  if (tableName.indexOf('.') > 0)
    tableName = tableName.split('.')[0];
  if (s.length > 0) {
    var field = s.substring(2, s.length - 1);
    var obj = doc.getElementById("sys_display." + tableName + "." + field);
    var val = "?";
    if (obj != null)
      val = obj.value;
    if (val.length == 0) {
      var labelText = "?";
      var labels = doc.getElementsByTagName("label");
      for (i = 0; i < labels.length; i++) {
        if (labels[i].htmlFor == tableName + "." + field) {
          labelText = labels[i].innerHTML;
          break;
        }
      }
      if (labelText.indexOf(':') > 0)
        labelText = labelText.split(':')[0];
      val = labelText;
    }
    re = new RegExp("%\\{" + field + "[\\}]", "g");
    var result = text.replace(re, val);
    if (result.indexOf("%{") > 0)
      result = replaceRegEx(result, doc, tableName);
    return result;
  }
  return text;
}

function toggleInline(name) {
  _toggleDisplay(name, 'inline');
}

function _toggleDisplay(name, displayType) {
  var e = $(name);
  if (e.style.display == 'none') {
    e.style.display = displayType;
    setPreference(name, displayType, null);
  } else {
    e.style.display = 'none';
    setPreference(name, 'none', null);
  }
}

function textareaResizer(id, change) {
  objectResizer(id, change, 'rows');
}

function textareaSizer(id, rows) {
  var element = $(id);
  if (element)
    setAttributeValue(element, 'rows', rows);
}

function selectResizer(id, change) {
  objectResizer(id, change, 'size');
}

function objectResizer(id, change, attrName) {
  var element = $(id);
  if (!element)
    return;
  var value = parseInt(element.style.height, 10)
  value += change;
  if (value < 1)
    value = 1;
  if (element.tagName == 'INPUT') {
    element = $("div." + id);
    if (element) {
      if (change > 0) {
        element.show();
      } else {
        element.hide();
        value = 1;
      }
    }
  } else {
    var oldRows = element.rows;
    element.style.height = value + 'px';
    handleMaxMinHeights(element, value);
    resizeTextAreaIframe(true, id, value);
  }
  setPreference('rows.' + id, value);
  _frameChanged();
}

function handleMaxMinHeights(element, height) {
  if (!element || !height)
    return;
  var $element = $(element),
    maxHeight = parseInt($element.getStyle('maxHeight'), 10),
    minHeight = parseInt($element.getStyle('minHeight'), 10),
    id = getAttributeValue($element, 'id');
  if (height >= maxHeight) {
    $('sizer_plus_' + id).addClassName('disabled');
    $element.setStyle({
      overflowY: 'auto'
    });
    return;
  }
  if (height <= minHeight) {
    $('sizer_minus_' + id).addClassName('disabled');
    return;
  }
  $('sizer_plus_' + id).removeClassName('disabled');
  $('sizer_minus_' + id).removeClassName('disabled');
}

function resizeTextAreaIframe() {
  var args = Array.prototype.slice.call(arguments, 0),
    tf = $("textarea_iframe." + id),
    doctype = args[0],
    id = args[1],
    height,
    oldRows,
    rows;
  if (doctype) {
    height = args[2];
  } else {
    rows = args[2];
    oldRows = args[3];
  }
  if (!tf) {
    tf = $(id + '_ifr');
    if (!tf)
      tf = $('textarea_iframe.' + id);
    if (tf) {
      var tbl = $(id + '_tbl');
      var readOnlyDiv = $(id + '_readOnlyDiv');
      if (doctype) {
        tf.style.height = (height + 60) + "px";
        if (tbl) {
          tbl.style.height = (height + 60) + "px";
        }
        if (readOnlyDiv) {
          readOnlyDiv.style.height = (height + 60) + "px";
        }
      } else {
        var elHeight = parseInt(tf.clientHeight);
        if (elHeight == 0 && readOnlyDiv)
          elHeight = parseInt(readOnlyDiv.style.height);
        var pixelsPerRow = 12;
        var newHeight = elHeight + (rows - oldRows) * pixelsPerRow;
        tf.style.height = newHeight + "px";
        if (tbl) {
          tbl.style.height = (parseInt(tbl.style.height) + (newHeight - elHeight)) + "px";
        }
        if (readOnlyDiv) {
          readOnlyDiv.style.height = newHeight + "px";
        }
      }
    }
  }
  if (!tf)
    return;
  if (!tf.parentNode)
    return;
  if (!tf.parentNode.nextSibling)
    return;
  var nid = tf.parentNode.nextSibling.id;
  if (nid != id)
    return;
  var elHeight = tf.clientHeight;
  var pixelsPerRow = Math.round(elHeight / oldRows);
  tf.style.height = rows * pixelsPerRow + "px";
}

function toggleQuestionRows(thisclass, display, fl) {
  forcelabels = false;
  if (fl == true)
    forcelabels = true;
  var rows = $(document.body).select('.' + thisclass);
  for (i = 0; i < rows.length; i++) {
    var element = rows[i];
    var id = element.id;
    if ('CATEGORY_LABEL' != id || forcelabels)
      element.style.display = display;
  }
  var openStyle = 'none';
  var closedStyle = 'none';
  if ('none' == display)
    openStyle = '';
  else
    closedStyle = '';
  var s = $(thisclass + 'CLOSED');
  s.style.display = closedStyle;
  s = $(thisclass + 'OPEN');
  s.style.display = openStyle;
}

function toggleWorkflow(id, expandPref) {
  var map = getMessages(['Expand', 'Collapse']);
  var table = $("workflow." + id);
  var spans = table.getElementsByTagName("span");
  for (var i = 0; i != spans.length; i++) {
    var span = spans[i];
    if (!span.getAttribute("stage"))
      continue;
    var spanImage = $(span.id + '.image');
    var spanText = $(span.id + '.text');
    if (span.getAttribute("selected") == 'true')
      spanText.style.color = "#2050d0";
    var filterImg = $('filterimg.' + id);
    if (expandPref == "false") {
      span.style.display = "";
      spanText.style.display = "none";
      filterImg.src = "images/filter_hide16.gifx";
      filterImg.title = map["Expand"];
      filterImg.alt = map["Expand"];
    } else {
      span.style.display = "block";
      spanText.style.display = "";
      filterImg.src = "images/filter_reveal16.gifx";
      filterImg.title = map["Collapse"];
      filterImg.alt = map["Collapse"];
    }
  }
  _frameChanged();
}

function togglePreference(id) {
  toggleItems(id);
}

function toggleItems(id, force) {
  var tables = $$("table");
  for (var i = 0; i < tables.length; i++) {
    var tableId = tables[i].id;
    if (tableId.indexOf("workflow.") == -1)
      continue;
    var idParts = tables[i].id.split(".");
    if (id && tableId != "workflow." + id)
      continue;
    var pref = getPref(idParts[1]);
    if (force != pref)
      toggleWorkflow(idParts[1], pref);
    if (id)
      break;
  }
}

function getPref(id) {
  var filterImgSrc = $('filterimg.' + id).src
  if (filterImgSrc.indexOf('filter_hide') != -1)
    return "true";
  return "false";
}
document.addEventListener('keyup', checkForClientKeystroke);

function checkForClientKeystroke(evt) {
  if (evt.keyCode == 27 && window.g_popup_manager) {
    g_popup_manager.destroypopDiv();
    return;
  }
  if (evt.shiftKey && evt.ctrlKey && evt.keyCode == 74) {
    var gWindow = new GlideDialogWindow("client_js");
    gWindow.setTitle("JavaScript Executor");
    gWindow.setPreference('table', 'javascript_executor');
    gWindow.render();
    Event.stop(evt);
    return;
  }
  try {
    if (typeof parent.navVisible == "function") {
      if (evt.ctrlKey && evt.keyCode == 190 && !evt.shiftKey && !evt.altKey) {
        Event.stop(evt);
        if (parent.navVisible()) {
          parent.hideNav();
          parent.hide("banner_top_left");
          parent.hide("banner_top_right");
        } else {
          parent.showNav();
          parent.show("banner_top_left");
          parent.show("banner_top_right");
        }
      }
    }
  } catch (e) {}
}

function toggleHelp(name) {
  var wrapper = $('help_' + name + '_wrapper');
  var image = $('img.help_' + name + '_wrapper');
  if (wrapper.style.display == "block") {
    wrapper.style.display = "none";
    image.src = "images/filter_hide16.gifx";
  } else {
    wrapper.style.display = "block";
    image.src = "images/filter_reveal16.gifx";
  }
  image.alt = getMessage("Display / Hide");
  _frameChanged();
}

function validateHex(field) {
  var num = field.value;
  var valid = isHex(num);
  if (!valid) {
    var sName = '';
    if (field.name != null)
      sName = ' of ' + field.name + ' ';
    alert("The entered value " + sName + "is not hex.  Please correct.");
  }
}

function isHex(num) {
  var str = num.replace(new RegExp('[0-9a-fA-F]', 'g'), '');
  if (str.length > 0)
    return false;
  return true;
}

function setLightWeightLink(name) {
  var v = $(name);
  if (!v)
    return;
  var link = $(name + "LINK");
  if (!link)
    return;
  var vis = "hidden";
  if (v.value != '')
    vis = "";
  link.style.visibility = vis;
  link.style.display = vis == 'hidden' ? 'none' : '';
}

function toggleDebug(id) {
  id = id.split('.')[1];
  for (var i = 0; i < 1000; i++) {
    var widgetName = 'debug.' + id + '.' + i;
    var w = $(widgetName);
    if (!w)
      return;
    w.toggle();
  }
}

function enterSubmitsForm(e, enter_submits_form) {
  if (e.keyCode != 13)
    return true;
  if (e.ctrlKey == true)
    return false;
  var source = Event.element(e);
  if (source.getAttribute("data-type") && e.keyCode == 13 && source.getAttribute("data-type") == 'ac_reference_input')
    return false;
  if (source && source.type == "textarea")
    return true;
  if (source && source.type == "submit") {
    if (source.disabled == false && source.onclick) {
      source.onclick();
      return false;
    }
  }
  if (enter_submits_form == 'false')
    return false;
  var headerElements = $(document.body).select(".header");
  var eSize = headerElements.length;
  for (var i = 0; i < eSize; i++) {
    var element = headerElements[i];
    if (element.type == "submit") {
      if (element.disabled == false) {
        source.blur();
        setTimeout(function() {
          element.onclick();
        }, 0);
        return false;
      }
    }
  }
  return false;
}

function gsftPrompt(title, question, onPromptComplete, onPromptCancel) {
  var dialog = new GlideDialogWindow('glide_prompt', false);
  dialog.setTitle(title);
  dialog.setPreference('title', question);
  dialog.setPreference('onPromptComplete', onPromptComplete);
  dialog.setPreference('onPromptCancel', onPromptCancel);
  dialog.render();
}

function gsftConfirm(title, question, onPromptSave, onPromptCancel, onPromptDiscard) {
  var width, dialogClass = GlideDialogWindow;
  if (window.GlideModal) {
    dialogClass = GlideModal;
    width = 400;
  }
  var dialog = new dialogClass('glide_confirm', false, width);
  dialog.setTitle(title);
  dialog.setPreference('title', question);
  dialog.setPreference('onPromptSave', onPromptSave);
  dialog.setPreference('onPromptCancel', onPromptCancel);
  dialog.setPreference('onPromptDiscard', onPromptDiscard);
  dialog.render();
}

function tsIndexCreatorPopup(tableName) {
  var gDialog = new GlideDialogWindow("dialog_text_index_creator");
  gDialog.setSize(400, 250);
  gDialog.setPreference("table_name", tableName);
  if (tableName != "")
    gDialog.setTitle('Generate Text Index');
  else
    gDialog.setTitle('Regenerate All Text Indexes');
  gDialog.render();
}

function isTextDirectionRTL() {
  return g_text_direction == 'rtl' ? true : false;
}

function simpleRemoveOption(sourceSelect) {
  var sourceOptions = sourceSelect.options;
  var selectedIds = [];
  var index = 0;
  for (var i = 0; i < sourceSelect.length; i++) {
    option = sourceOptions[i];
    if (option.selected) {
      selectedIds[index] = i;
      index++;
    }
  }
  for (var i = selectedIds.length - 1; i > -1; i--)
    sourceSelect.remove(selectedIds[i]);
  sourceSelect.disabled = true;
  sourceSelect.disabled = false;
}

function saveAllSelected(fromSelectArray, toArray, delim, escape, emptyLabel, doEscape) {
  var translatedEmptyLabel = getMessage(emptyLabel);
  for (var i = 0; i < fromSelectArray.length; i++) {
    if (typeof fromSelectArray[i] == 'undefined') {
      toArray[i].value = '';
      continue;
    }
    var toValue = "";
    for (var j = 0; j < fromSelectArray[i].length; j++) {
      if (!(fromSelectArray[i].length == 1 && fromSelectArray[i].options[0].value == translatedEmptyLabel)) {
        var val = fromSelectArray[i].options[j].value;
        if (doEscape)
          val = encodeURIComponent(val);
        toValue += val.replace(new RegExp(delim, "g"), escape + delim);
      }
      if (j + 1 < fromSelectArray[i].length)
        toValue += delim;
    }
    toArray[i].value = toValue;
  }
}

function sortSelect(obj) {
  var maxSort = obj.getAttribute("max_sort");
  if (!maxSort || maxSort == 0)
    maxSort = 500;
  if (obj.length > maxSort && isMSIE && !isMSIE9) {
    return;
  }
  if (!sortSupported(obj)) {
    return;
  }
  if (!hasOptions(obj)) {
    return;
  }
  var o = [];
  var o2 = [];
  var o3 = [];
  for (var i = 0; i < obj.options.length; i++) {
    var newOption = new Option(obj.options[i].text, obj.options[i].value, obj.options[i].defaultSelected, obj.options[i].selected);
    copyAttributes(obj.options[i], newOption);
    if (newOption.value.indexOf('split') > 0)
      o2[o2.length] = newOption;
    else if (newOption.value && newOption.value.substr(0, 2) !== "u_" && (newOption.value.indexOf('formatter') > 0 || newOption.value.indexOf('component') > 0 ||
        newOption.value.indexOf('annotation') > 0 || newOption.value.indexOf('chart') > 0))
      o3[o3.length] = newOption;
    else
      o[o.length] = newOption;
  }
  if (o.length == 0)
    return;
  o = o.sort(
    function(a, b) {
      if ((a.text.toLowerCase() + "") < (b.text.toLowerCase() + "")) {
        return -1;
      }
      if ((a.text.toLowerCase() + "") > (b.text.toLowerCase() + "")) {
        return 1;
      }
      return 0;
    }
  );
  o3 = o3.sort(
    function(a, b) {
      if ((a.text.toLowerCase() + "") < (b.text.toLowerCase() + "")) {
        return -1;
      }
      if ((a.text.toLowerCase() + "") > (b.text.toLowerCase() + "")) {
        return 1;
      }
      return 0;
    }
  );
  for (var i = 0; i < o.length; i++) {
    var newOption = new Option(o[i].text, o[i].value, o[i].defaultSelected, o[i].selected);
    copyAttributes(o[i], newOption);
    obj.options[i] = newOption;
  }
  var counter = 0;
  for (var i = o.length; i < (o.length + o2.length); i++) {
    var newOption = new Option(o2[counter].text, o2[counter].value, o2[counter].defaultSelected, o2[counter].selected);
    copyAttributes(o2[counter], newOption);
    obj.options[i] = newOption;
    counter++;
  }
  var counter = 0;
  for (var i = (o.length + o2.length); i < (o.length + o2.length + o3.length); i++) {
    var newOption = new Option(o3[counter].text, o3[counter].value, o3[counter].defaultSelected, o3[counter].selected);
    copyAttributes(o3[counter], newOption);
    obj.options[i] = newOption;
    counter++;
  }
}

function copyAttributes(from, to) {
  var attributes = from.attributes;
  for (var n = 0; n < attributes.length; n++) {
    var attr = attributes[n];
    var aname = attr.nodeName;
    var avalue = attr.nodeValue;
    to.setAttribute(aname, avalue);
  }
  if (from.style.cssText)
    to.style.cssText = from.style.cssText;
}

function hasOptions(obj) {
  if (obj != null && obj.options != null)
    return true;
  return false;
}

function sortSupported(obj) {
  if (obj == null)
    return false;
  var noSort = obj.no_sort || obj.getAttribute('no_sort');
  if (noSort) {
    return false;
  }
  return true;
};
/*! RESOURCE: /scripts/doctype/utils14.js */
function doNothing() {}

function valueExistsInArray(val, array) {
  for (var i = 0; i < array.length; i++) {
    if (val == array[i])
      return true;
  }
  return false;
}

function doubleDigitFormat(num) {
  return padLeft(num, 2, "0");
}

function tripleDigitFormat(num) {
  return padLeft(num, 3, "0");
}

function sGetHours(totalSecs) {
  return parseInt(totalSecs / (60 * 60), 10);
}

function sGetMinutes(totalSecs) {
  totalSecs -= (60 * 60) * sGetHours(totalSecs);
  return parseInt(totalSecs / 60, 10);
}

function sGetSeconds(totalSecs) {
  totalSecs -= (60 * 60) * sGetHours(totalSecs);
  totalSecs -= (60) * sGetMinutes(totalSecs);
  return parseInt(totalSecs, 10);
}

function isNumber(test) {
  if (!test)
    return false;
  test = new String(test);
  var _numer = test.search("[^0-9]");
  return _numer == -1;
}

function isAlphaNum(thchar) {
  return isAlpha(thchar) || isDigit(thchar);
}

function isAlpha(thchar) {
  return (thchar >= 'a' && thchar <= 'z\uffff') || (thchar >= 'A' && thchar <= 'Z\uffff') || thchar == '_';
}

function isDigit(thchar) {
  return (thchar >= '0' && thchar <= '9');
}

function containsOnlyChars(validChars, sText) {
  if (!sText)
    return true;
  for (var i = 0; i < sText.length; i++) {
    var c = sText.charAt(i);
    if (validChars.indexOf(c) == -1)
      return false;
  }
  return true;
}

function getAttributeValue(element, attrName) {
  return element.getAttribute(attrName);
}

function setAttributeValue(element, attrName, value) {
  element.setAttribute(attrName, value);
}

function toggleDivDisplayAndReturn(divName) {
  if (!divName)
    return;
  var div = $(divName);
  if (!div)
    return;
  if (div.style.display == "none")
    showObject(div);
  else
    hideObject(div);
  return div;
}

function toggleDivDisplay(divName) {
  toggleDivDisplayAndReturn(divName);
}

function findParentByTag(element, tag) {
  var ret;
  while (element && element.parentNode && element.parentNode.tagName) {
    element = element.parentNode;
    if (element.tagName.toLowerCase() == tag.toLowerCase())
      return element;
  }
  return ret;
}

function replaceAll(str, from, to) {
  var idx = str.indexOf(from);
  while (idx > -1) {
    str = str.replace(from, to);
    idx = str.indexOf(from);
  }
  return str;
}

function useAnimation() {
  if (isTouchDevice)
    return false;
  return true;
}

function expandEffect(el, duration, steps, stepCallback, completionCallback) {
  if (!useAnimation()) {
    showObject(el);
    if (completionCallback)
      completionCallback(el);
    return;
  }
  var h;
  if (el.originalHeight)
    h = el.originalHeight;
  else {
    h = getHeight(el);
    if (h == 0) {
      showObject(el);
      return;
    }
    el.originalHeight = h;
  }
  if (!duration)
    duration = 70;
  if (!steps)
    steps = 14;
  el.style.overflow = "hidden";
  el.style.height = "1px";
  el.style.display = "block";
  el.style.visibility = "visible";
  expandAnimationEffect(el, h, duration, steps, stepCallback, completionCallback);
  return h;
}

function expandAnimationEffect(el, height, duration, steps, stepCallback, completionCallback) {
  new Rico.Effect.Size(el.id, null, height, duration, steps, {
    step: function() {
      if (stepCallback)
        stepCallback(el);
    },
    complete: function() {
      _expandComplete(el, completionCallback);
    }
  });
}

function _expandComplete(el, completionCallback) {
  el.style.overflow = "";
  el.style.height = "auto";
  if (completionCallback)
    completionCallback(el);
  _frameChanged();
}

function collapseEffect(el, duration, steps) {
  if (!useAnimation()) {
    hideObject(el);
    return;
  }
  var h;
  if (el.originalHeight)
    h = el.originalHeight;
  else {
    h = el.offsetHeight;
    el.originalHeight = h;
  }
  if (!duration)
    duration = 70;
  if (!steps)
    steps = 14;
  if (!h)
    h = el.offsetHeight;
  el.style.overflow = "hidden";
  collapseAnimationEffect(el, h, duration, steps);
}

function collapseAnimationEffect(el, height, duration, steps) {
  new Rico.Effect.Size(el.id, null, 1, duration, steps, {
    complete: function() {
      _collapseComplete(el, height);
    }
  });
}

function _collapseComplete(el, height) {
  el.style.display = "none";
  el.style.overflow = "";
  el.style.height = height;
  _frameChanged();
}

function getHeight(el) {
  var item;
  try {
    item = el.cloneNode(true);
  } catch (e) {
    jslog("getHeight blew up... we caught the error and returned 0")
    return 0;
  }
  var height = 0;
  item.style.visibility = "hidden";
  item.style.display = "block";
  item.style.position = "absolute";
  item.style.top = 0;
  item.style.left = 0;
  document.body.appendChild(item);
  height = item.offsetHeight;
  document.body.removeChild(item);
  return height;
}

function getWidth(el) {
  var item = el.cloneNode(true);
  var width = 0;
  item.style.visibility = "hidden";
  item.style.display = "block";
  item.style.position = "absolute";
  item.style.top = 0;
  item.style.left = 0;
  document.body.appendChild(item);
  width = item.offsetWidth;
  document.body.removeChild(item);
  return width;
}

function grabOffsetLeft(item) {
  return getOffset(item, "offsetLeft")
}

function grabOffsetTop(item) {
  return getOffset(item, "offsetTop")
}

function getOffset(item, attr) {
  var parentElement = getFormContentParent();
  var wb = 0;
  while (item) {
    wb += item[attr];
    item = item.offsetParent;
    if (item == parentElement)
      break;
  }
  return wb;
}

function grabScrollLeft(item) {
  return getScrollOffset(item, "scrollLeft")
}

function grabScrollTop(item) {
  return getScrollOffset(item, "scrollTop")
}

function getScrollOffset(item, attr) {
  var parentElement = getFormContentParent();
  var wb = 0;
  while (item && item.tagName && item != parentElement) {
    wb += item[attr];
    if (isMSIE)
      item = item.offsetParent;
    else
      item = item.parentNode;
  }
  return wb;
}

function getValue(evt) {
  var elem = evt.target;
  if (!elem)
    return null;
  try {
    return elem.options[elem.selectedIndex].value;
  } catch (e) {
    var msg = (typeof e == "string") ? e : ((e.message) ? e.message : "Unknown Error");
    alert("Unable to get data:\n" + msg);
  }
  return null;
}

function getEvent(event) {
  return event;
}

function getEventCoords(e) {
  var fudge = getFormContentParent();
  var answer = Event.pointer(e);
  answer = new Point(answer.x, answer.y);
  if (fudge == document.body)
    return answer;
  answer.x += fudge.scrollLeft;
  answer.y += fudge.scrollTop;
  var fudgeTop = fudge.getStyle('top');
  var fudgePos = fudge.getStyle('position');
  if (fudgePos == 'absolute' && fudgeTop && fudgeTop.indexOf('px'))
    answer.y -= parseInt(fudgeTop.replace('px', ''));
  return answer;
}

function getRelativeTop() {
  var port = document.viewport;
  var topLeft = new Point(port.getScrollOffsets().left, port.getScrollOffsets().top)
  var fudge = getFormContentParent();
  if (fudge != document.body) {
    topLeft.x += fudge.scrollLeft;
    topLeft.y += fudge.scrollTop;
  }
  return topLeft;
}

function getRealEvent(e) {
  if (isTouchDevice && isTouchEvent(e)) {
    e = e.changedTouches[0];
  }
  return e;
}

function isTouchEvent(e) {
  if (typeof e == 'undefined' || typeof e.changedTouches == 'undefined')
    return false;
  return true;
}

function isTouchRightClick(e) {
  if (!isTouchEvent(e))
    return false;
  var hasTwoFingers = e.changedTouches.length > 1;
  return hasTwoFingers;
}

function getTextValue(node) {
  if (node.textContent)
    return node.textContent;
  var firstNode = node.childNodes[0];
  if (!firstNode)
    return null;
  if (firstNode.data)
    return firstNode.data;
  return firstNode.nodeValue;
}

function getScrollX() {
  return window.pageXOffset;
}

function getScrollY() {
  return window.pageYOffset;
}

function getSrcElement(evt) {
  return evt.target;
}

function addForm() {
  var form = cel('form');
  document.body.appendChild(form);
  if (window.g_ck)
    addHidden(form, "sysparm_ck", g_ck);
  return form;
}

function addHidden(form, name, value) {
  addInput(form, 'HIDDEN', name, value);
}

function addInput(form, type, name, value) {
  var inputs = Form.getInputs(form, '', name);
  if (inputs.length > 0) {
    inputs[0].value = value;
    return;
  }
  var opt = document.createElement('input');
  opt.type = type;
  opt.name = name;
  opt.id = name;
  opt.value = value;
  form.appendChild(opt);
}

function getHiddenInputValuesMap(parent) {
  var valuesMap = {}
  var inputs = parent.getElementsByTagName('input');
  for (var i = 0; i < inputs.length; i++) {
    var input = inputs[i];
    if (input.type.toLowerCase() != "hidden")
      continue;
    valuesMap[input.id] = input.value;
  }
  return valuesMap;
}

function appendSelectOption(select, value, label, index) {
  var opt = document.createElement("option");
  opt.value = value;
  opt.appendChild(label);
  if (index >= 0 && index != select.length)
    select.insertBefore(opt, select.children[index]);
  else
    select.appendChild(opt);
  return opt;
}

function copySelectOptionToIndex(select, opt, index) {
  var label = opt.text;
  opt.innerHTML = "";
  opt.appendChild(document.createTextNode(label));
  if (index >= 0 && index != select.length)
    select.insertBefore(opt, select.children[index]);
  else
    select.appendChild(opt);
  return opt;
}

function selectMenuItem(id, selectName) {
  var selectMenu = document.getElementById(selectName);
  if (!selectMenu)
    return -1;
  var options = selectMenu.options;
  var selectItem = selectMenu.selectedIndex;
  if (id) {
    for (var i = 0; i < options.length; i++) {
      var option = options[i];
      if (option.value == id) {
        selectItem = i;
        break;
      }
    }
  }
  if (selectItem > 0) {
    selectMenu.selectedIndex = selectItem;
    if (selectMenu["onchange"]) {
      selectMenu.onchange();
    }
  }
  return selectItem;
}

function menuIsEmpty(selectName) {
  var selectMenu = document.getElementById(selectName);
  if (!selectMenu || selectMenu.selectedIndex <= 0)
    return true;
  return false;
}

function getBounds(obj, addScroll) {
  var x = grabOffsetLeft(obj);
  var y = grabOffsetTop(obj);
  if (addScroll) {
    x += getScrollX();
    y += getScrollY();
  }
  this.absoluteRect = {
    top: y,
    left: x,
    bottom: y + obj.offsetHeight,
    right: x + obj.offsetWidth,
    height: obj.offsetHeight,
    width: obj.offsetWidth,
    middleX: x + (obj.offsetWidth / 2),
    middleY: y + (obj.offsetHeight / 2),
    cbottom: y + obj.clientHeight,
    cright: x + obj.clientWidth
  };
  return this.absoluteRect;
}

function guid(l) {
  var l = l || 32,
    strResult = '';
  while (strResult.length < l)
    strResult += (((1 + Math.random() + new Date().getTime()) * 0x10000) | 0).toString(16).substring(1);
  return strResult.substr(0, l);
}

function stopSelection(e) {
  e.onselectstart = function() {
    return false;
  };
  e.style.MozUserSelect = "none";
}

function restoreSelection(e) {
  e.onselectstart = null;
  e.style.MozUserSelect = "";
}

function getAttributeValue(element, name) {
  if (!element.attributes)
    return null;
  var v = element.attributes.getNamedItem(name);
  if (v == null)
    return null;
  return v.nodeValue;
}

function createImage(src, title, object, onClick) {
  var img = cel('input');
  img.type = 'image';
  img.src = src;
  img.title = title;
  img.alt = title;
  if (arguments.length == 4)
    img.onclick = onClick.bindAsEventListener(object);
  return img;
}

function createIcon(cls, title, object, onClick) {
  var icn = cel('a');
  icn.addClassName(cls);
  icn.setAttribute('title', title);
  if (arguments.length == 4)
    icn.onclick = onClick.bindAsEventListener(object);
  return icn;
}

function getXMLString(node) {
  var xml = "???";
  if (node.xml) {
    xml = node.xml;
  } else if (window.XMLSerializer) {
    xml = (new XMLSerializer()).serializeToString(node);
  }
  return xml;
}

function isLeftClick(e) {
  return e.button == 0;
}

function formatMessage() {
  if (arguments.length == 1)
    return arguments[0];
  var str = arguments[0];
  var args = arguments;
  if (arguments.length == 2 && typeof arguments[1] == 'object' && arguments[1] instanceof Array) {
    args = [''].concat(arguments[1]);
  }
  var i = 0;
  while (++i < args.length) {
    str = str.replace(new RegExp('\\{' + (i - 1) + '\\}', 'g'), args[i]);
  }
  return str;
}

function getFormattedDateAndTime(date) {
  return getFormattedDate(date) + " " + getFormattedTime(date);
}

function getFormattedDate(date) {
  var d = (date ? date : new Date());
  var curr_mon = d.getMonth() + 1;
  var curr_day = d.getDate();
  var curr_year = d.getYear() - 100;
  return doubleDigitFormat(curr_mon) + "/" + doubleDigitFormat(curr_day) + "/" + doubleDigitFormat(curr_year)
}

function getFormattedTime(date) {
  var d = (date ? date : new Date());
  var curr_hour = d.getHours();
  var curr_min = d.getMinutes();
  var curr_sec = d.getSeconds();
  var curr_msec = d.getMilliseconds();
  return doubleDigitFormat(curr_hour) + ":" + doubleDigitFormat(curr_min) + ":" + doubleDigitFormat(curr_sec) + " (" + tripleDigitFormat(curr_msec) + ")"
}

function showGoToLine(textAreaID) {
  var e = gel("go_to_" + textAreaID)
  if (e) {
    showObjectInline(e);
    gel("go_to_input_" + textAreaID).focus();
  }
}

function gotoLineKeyPress(evt, textAreaObject, input) {
  if (evt.keyCode == 13) {
    Event.stop(evt);
    gotoLinePopup(textAreaObject, input.value);
    input.value = "";
    hideObject(input.parentNode);
  }
}

function gotoLinePopup(textAreaObject, lineText) {
  if (lineText) {
    lineText = trim(lineText);
    if (lineText) {
      var line = parseInt(lineText, 10);
      g_form._setCaretPositionLineColumn(textAreaObject, line, 1);
    }
  }
}

function getBrowserWindowHeight() {
  return window.innerHeight;
}

function getBrowserWindowWidth() {
  return window.innerWidth;
}
var WindowSize = function() {
  return {
    width: getBrowserWindowWidth(),
    height: getBrowserWindowHeight()
  }
}

function getScrollBarWidthPx() {
  var inner = cel("p");
  inner.style.width = "100%";
  inner.style.height = "200px";
  var outer = cel("div");
  outer.style.position = "absolute";
  outer.style.top = "0px";
  outer.style.left = "0px";
  outer.style.visibility = "hidden";
  outer.style.width = "200px";
  outer.style.height = "150px";
  outer.style.overflow = "hidden";
  outer.appendChild(inner);
  document.body.appendChild(outer);
  var w1 = inner.offsetWidth;
  outer.style.overflow = "scroll";
  var w2 = inner.offsetWidth;
  if (w1 == w2) w2 = outer.clientWidth;
  document.body.removeChild(outer);
  return (w1 - w2);
}

function showOpticsDebugger() {
  var mainWindow = getMainWindow();
  if (mainWindow)
    mainWindow.CustomEvent.fire('glide_optics_inspect_window_open');
}

function opticsLog(tablename, fieldname, message, oldvalue, newvalue) {
  var info = {};
  info.table = tablename;
  info.field = fieldname;
  info.message = message;
  info.message_type = "static";
  if (oldvalue && newvalue) {
    info.oldvalue = oldvalue;
    info.newvalue = newvalue;
    info.message_type = "change";
  }
  CustomEvent.fire('glide_optics_inspect_log_message', info);
};
/*! RESOURCE: /scripts/formatting.js */
function formatPhone(field) {
  field.value = trim(field.value);
  var ov = field.value;
  var v = "";
  var x = -1;
  if (0 < ov.length && '+' != ov.charAt(0)) {
    var n = 0;
    if ('1' == ov.charAt(0)) {
      ov = ov.substring(1, ov.length);
    }
    for (i = 0; i < ov.length; i++) {
      var ch = ov.charAt(i);
      if (ch >= '0' && ch <= '9') {
        if (n == 0) v += "(";
        else if (n == 3) v += ") ";
        else if (n == 6) v += "-";
        v += ch;
        n++;
      }
      if (!(ch >= '0' && ch <= '9') && ch != ' ' && ch != '-' && ch != '.' && ch != '(' && ch != ')') {
        x = i;
        break;
      }
    }
    if (x >= 0) v += " " + ov.substring(x, ov.length);
    if (n == 10 && v.length <= 40) field.value = v;
  }
  return true;
}

function formatClean(num) {
  var sVal = '';
  var nVal = num.length;
  var sChar = '';
  try {
    for (i = 0; i < nVal; i++) {
      sChar = num.charAt(i);
      nChar = sChar.charCodeAt(0);
      if (sChar == '-' || sChar == getDecimalSeparator() || ((nChar >= 48) && (nChar <= 57))) {
        sVal += num.charAt(i);
      }
    }
  } catch (exception) {
    alertError("formatClean", exception);
  }
  return sVal;
}

function formatCurrency(num) {
  var sVal = '';
  var minus = '';
  if (num.lastIndexOf("-") == 0) {
    minus = '-';
  }
  if (num.lastIndexOf(".") < 0) {
    num = num + '00';
  }
  num = formatClean(num);
  sVal = minus + formatDollar(num, getGroupingSeparator()) + getDecimalSeparator() + formatCents(num);
  return sVal;
}

function formatNumber(num) {
  if (num.length == 0)
    return num;
  num = new String(num);
  var sVal = '';
  var minus = '';
  try {
    if (num.lastIndexOf("-") == 0) {
      minus = '-';
    }
    num = formatClean(num);
    if (num.indexOf("-") == 0)
      num = num.substring(1);
    num = "0" + num;
    var fraction = parseFraction(new String(num));
    num = parseInt(num, 10);
    var samount = new String(num);
    for (var i = 0; i < Math.floor((samount.length - (1 + i)) / 3); i++) {
      samount = samount.substring(0, samount.length - (4 * i + 3)) + getGroupingSeparator() + samount.substring(samount.length - (4 * i + 3));
    }
    if (fraction.length > 0) {
      fraction = getDecimalSeparator() + fraction;
      samount += fraction;
    }
  } catch (exception) {
    alertError("Format Number", exception);
  }
  return minus + samount;
}

function parseFraction(num) {
  var index = num.indexOf(getDecimalSeparator());
  if (index == -1)
    return "";
  return num.substring(index + 1);
}

function formatCents(amount) {
  var cents = '';
  try {
    amount = parseInt(amount, 10);
    var samount = new String(amount);
    if (samount.length == 0) {
      return '00';
    }
    if (samount.length == 1) {
      return '0' + samount;
    }
    if (samount.length == 2) {
      return samount;
    }
    cents = samount.substring(samount.length - 2, samount.length);
  } catch (exception) {
    alertError("Format Cents", e);
  }
  return cents;
}

function formatDollar(amount) {
  try {
    amount = parseInt(amount, 10);
    var samount = new String(amount);
    if (samount.length < 3)
      return 0;
    samount = samount.substring(0, samount.length - 2);
    for (var i = 0; i < Math.floor((samount.length - (1 + i)) / 3); i++) {
      samount = samount.substring(0, samount.length - (4 * i + 3)) + getGroupingSeparator() + samount.substring(samount.length - (4 * i + 3));
    }
  } catch (exception) {
    alertError("Format Dollar", e);
  }
  return samount;
}

function padLeft(value, width, fill) {
  value = value + '';
  while (value.length < width)
    value = fill + value;
  return value;
}

function getDecimalSeparator() {
  if (g_user_decimal_separator)
    return g_user_decimal_separator;
  return ".";
}

function getGroupingSeparator() {
  if (g_user_grouping_separator)
    return g_user_grouping_separator;
  return ",";
}

function alertError(MethodName, e) {
  if (e.description == null) {
    alert(MethodName + " Exception: " + e.message);
  } else {
    alert(MethodName + " Exception: " + e.description);
  }
};
/*! RESOURCE: /scripts/lib/jquery/jquery-1.8.2.min.js */
/*! jQuery v1.8.2 jquery.com | jquery.org/license */
(function(a, b) {
    function G(a) {
      var b = F[a] = {};
      return p.each(a.split(s), function(a, c) {
        b[c] = !0
      }), b
    }

    function J(a, c, d) {
      if (d === b && a.nodeType === 1) {
        var e = "data-" + c.replace(I, "-$1").toLowerCase();
        d = a.getAttribute(e);
        if (typeof d == "string") {
          try {
            d = d === "true" ? !0 : d === "false" ? !1 : d === "null" ? null : +d + "" === d ? +d : H.test(d) ? p.parseJSON(d) : d
          } catch (f) {}
          p.data(a, c, d)
        } else d = b
      }
      return d
    }

    function K(a) {
      var b;
      for (b in a) {
        if (b === "data" && p.isEmptyObject(a[b])) continue;
        if (b !== "toJSON") return !1
      }
      return !0
    }

    function ba() {
      return !1
    }

    function bb() {
      return !0
    }

    function bh(a) {
      return !a || !a.parentNode || a.parentNode.nodeType === 11
    }

    function bi(a, b) {
      do a = a[b]; while (a && a.nodeType !== 1);
      return a
    }

    function bj(a, b, c) {
      b = b || 0;
      if (p.isFunction(b)) return p.grep(a, function(a, d) {
        var e = !!b.call(a, d, a);
        return e === c
      });
      if (b.nodeType) return p.grep(a, function(a, d) {
        return a === b === c
      });
      if (typeof b == "string") {
        var d = p.grep(a, function(a) {
          return a.nodeType === 1
        });
        if (be.test(b)) return p.filter(b, d, !c);
        b = p.filter(b, d)
      }
      return p.grep(a, function(a, d) {
        return p.inArray(a, b) >= 0 === c
      })
    }

    function bk(a) {
      var b = bl.split("|"),
        c = a.createDocumentFragment();
      if (c.createElement)
        while (b.length) c.createElement(b.pop());
      return c
    }

    function bC(a, b) {
      return a.getElementsByTagName(b)[0] || a.appendChild(a.ownerDocument.createElement(b))
    }

    function bD(a, b) {
      if (b.nodeType !== 1 || !p.hasData(a)) return;
      var c, d, e, f = p._data(a),
        g = p._data(b, f),
        h = f.events;
      if (h) {
        delete g.handle, g.events = {};
        for (c in h)
          for (d = 0, e = h[c].length; d < e; d++) p.event.add(b, c, h[c][d])
      }
      g.data && (g.data = p.extend({}, g.data))
    }

    function bE(a, b) {
      var c;
      if (b.nodeType !== 1) return;
      b.clearAttributes && b.clearAttributes(), b.mergeAttributes && b.mergeAttributes(a), c = b.nodeName.toLowerCase(), c === "object" ? (b.parentNode && (b.outerHTML = a.outerHTML), p.support.html5Clone && a.innerHTML && !p.trim(b.innerHTML) && (b.innerHTML = a.innerHTML)) : c === "input" && bv.test(a.type) ? (b.defaultChecked = b.checked = a.checked, b.value !== a.value && (b.value = a.value)) : c === "option" ? b.selected = a.defaultSelected : c === "input" || c === "textarea" ? b.defaultValue = a.defaultValue : c === "script" && b.text !== a.text && (b.text = a.text), b.removeAttribute(p.expando)
    }

    function bF(a) {
      return typeof a.getElementsByTagName != "undefined" ? a.getElementsByTagName("*") : typeof a.querySelectorAll != "undefined" ? a.querySelectorAll("*") : []
    }

    function bG(a) {
      bv.test(a.type) && (a.defaultChecked = a.checked)
    }

    function bY(a, b) {
      if (b in a) return b;
      var c = b.charAt(0).toUpperCase() + b.slice(1),
        d = b,
        e = bW.length;
      while (e--) {
        b = bW[e] + c;
        if (b in a) return b
      }
      return d
    }

    function bZ(a, b) {
      return a = b || a, p.css(a, "display") === "none" || !p.contains(a.ownerDocument, a)
    }

    function b$(a, b) {
      var c, d, e = [],
        f = 0,
        g = a.length;
      for (; f < g; f++) {
        c = a[f];
        if (!c.style) continue;
        e[f] = p._data(c, "olddisplay"), b ? (!e[f] && c.style.display === "none" && (c.style.display = ""), c.style.display === "" && bZ(c) && (e[f] = p._data(c, "olddisplay", cc(c.nodeName)))) : (d = bH(c, "display"), !e[f] && d !== "none" && p._data(c, "olddisplay", d))
      }
      for (f = 0; f < g; f++) {
        c = a[f];
        if (!c.style) continue;
        if (!b || c.style.display === "none" || c.style.display === "") c.style.display = b ? e[f] || "" : "none"
      }
      return a
    }

    function b_(a, b, c) {
      var d = bP.exec(b);
      return d ? Math.max(0, d[1] - (c || 0)) + (d[2] || "px") : b
    }

    function ca(a, b, c, d) {
      var e = c === (d ? "border" : "content") ? 4 : b === "width" ? 1 : 0,
        f = 0;
      for (; e < 4; e += 2) c === "margin" && (f += p.css(a, c + bV[e], !0)), d ? (c === "content" && (f -= parseFloat(bH(a, "padding" + bV[e])) || 0), c !== "margin" && (f -= parseFloat(bH(a, "border" + bV[e] + "Width")) || 0)) : (f += parseFloat(bH(a, "padding" + bV[e])) || 0, c !== "padding" && (f += parseFloat(bH(a, "border" + bV[e] + "Width")) || 0));
      return f
    }

    function cb(a, b, c) {
      var d = b === "width" ? a.offsetWidth : a.offsetHeight,
        e = !0,
        f = p.support.boxSizing && p.css(a, "boxSizing") === "border-box";
      if (d <= 0 || d == null) {
        d = bH(a, b);
        if (d < 0 || d == null) d = a.style[b];
        if (bQ.test(d)) return d;
        e = f && (p.support.boxSizingReliable || d === a.style[b]), d = parseFloat(d) || 0
      }
      return d + ca(a, b, c || (f ? "border" : "content"), e) + "px"
    }

    function cc(a) {
      if (bS[a]) return bS[a];
      var b = p("<" + a + ">").appendTo(e.body),
        c = b.css("display");
      b.remove();
      if (c === "none" || c === "") {
        bI = e.body.appendChild(bI || p.extend(e.createElement("iframe"), {
          frameBorder: 0,
          width: 0,
          height: 0
        }));
        if (!bJ || !bI.createElement) bJ = (bI.contentWindow || bI.contentDocument).document, bJ.write("<!doctype html><html><body>"), bJ.close();
        b = bJ.body.appendChild(bJ.createElement(a)), c = bH(b, "display"), e.body.removeChild(bI)
      }
      return bS[a] = c, c
    }

    function ci(a, b, c, d) {
      var e;
      if (p.isArray(b)) p.each(b, function(b, e) {
        c || ce.test(a) ? d(a, e) : ci(a + "[" + (typeof e == "object" ? b : "") + "]", e, c, d)
      });
      else if (!c && p.type(b) === "object")
        for (e in b) ci(a + "[" + e + "]", b[e], c, d);
      else d(a, b)
    }

    function cz(a) {
      return function(b, c) {
        typeof b != "string" && (c = b, b = "*");
        var d, e, f, g = b.toLowerCase().split(s),
          h = 0,
          i = g.length;
        if (p.isFunction(c))
          for (; h < i; h++) d = g[h], f = /^\+/.test(d), f && (d = d.substr(1) || "*"), e = a[d] = a[d] || [], e[f ? "unshift" : "push"](c)
      }
    }

    function cA(a, c, d, e, f, g) {
      f = f || c.dataTypes[0], g = g || {}, g[f] = !0;
      var h, i = a[f],
        j = 0,
        k = i ? i.length : 0,
        l = a === cv;
      for (; j < k && (l || !h); j++) h = i[j](c, d, e), typeof h == "string" && (!l || g[h] ? h = b : (c.dataTypes.unshift(h), h = cA(a, c, d, e, h, g)));
      return (l || !h) && !g["*"] && (h = cA(a, c, d, e, "*", g)), h
    }

    function cB(a, c) {
      var d, e, f = p.ajaxSettings.flatOptions || {};
      for (d in c) c[d] !== b && ((f[d] ? a : e || (e = {}))[d] = c[d]);
      e && p.extend(!0, a, e)
    }

    function cC(a, c, d) {
      var e, f, g, h, i = a.contents,
        j = a.dataTypes,
        k = a.responseFields;
      for (f in k) f in d && (c[k[f]] = d[f]);
      while (j[0] === "*") j.shift(), e === b && (e = a.mimeType || c.getResponseHeader("content-type"));
      if (e)
        for (f in i)
          if (i[f] && i[f].test(e)) {
            j.unshift(f);
            break
          }
      if (j[0] in d) g = j[0];
      else {
        for (f in d) {
          if (!j[0] || a.converters[f + " " + j[0]]) {
            g = f;
            break
          }
          h || (h = f)
        }
        g = g || h
      }
      if (g) return g !== j[0] && j.unshift(g), d[g]
    }

    function cD(a, b) {
      var c, d, e, f, g = a.dataTypes.slice(),
        h = g[0],
        i = {},
        j = 0;
      a.dataFilter && (b = a.dataFilter(b, a.dataType));
      if (g[1])
        for (c in a.converters) i[c.toLowerCase()] = a.converters[c];
      for (; e = g[++j];)
        if (e !== "*") {
          if (h !== "*" && h !== e) {
            c = i[h + " " + e] || i["* " + e];
            if (!c)
              for (d in i) {
                f = d.split(" ");
                if (f[1] === e) {
                  c = i[h + " " + f[0]] || i["* " + f[0]];
                  if (c) {
                    c === !0 ? c = i[d] : i[d] !== !0 && (e = f[0], g.splice(j--, 0, e));
                    break
                  }
                }
              }
            if (c !== !0)
              if (c && a["throws"]) b = c(b);
              else try {
                b = c(b)
              } catch (k) {
                return {
                  state: "parsererror",
                  error: c ? k : "No conversion from " + h + " to " + e
                }
              }
          }
          h = e
        }
      return {
        state: "success",
        data: b
      }
    }

    function cL() {
      try {
        return new a.XMLHttpRequest
      } catch (b) {}
    }

    function cM() {
      try {
        return new a.ActiveXObject("Microsoft.XMLHTTP")
      } catch (b) {}
    }

    function cU() {
      return setTimeout(function() {
        cN = b
      }, 0), cN = p.now()
    }

    function cV(a, b) {
      p.each(b, function(b, c) {
        var d = (cT[b] || []).concat(cT["*"]),
          e = 0,
          f = d.length;
        for (; e < f; e++)
          if (d[e].call(a, b, c)) return
      })
    }

    function cW(a, b, c) {
      var d, e = 0,
        f = 0,
        g = cS.length,
        h = p.Deferred().always(function() {
          delete i.elem
        }),
        i = function() {
          var b = cN || cU(),
            c = Math.max(0, j.startTime + j.duration - b),
            d = 1 - (c / j.duration || 0),
            e = 0,
            f = j.tweens.length;
          for (; e < f; e++) j.tweens[e].run(d);
          return h.notifyWith(a, [j, d, c]), d < 1 && f ? c : (h.resolveWith(a, [j]), !1)
        },
        j = h.promise({
          elem: a,
          props: p.extend({}, b),
          opts: p.extend(!0, {
            specialEasing: {}
          }, c),
          originalProperties: b,
          originalOptions: c,
          startTime: cN || cU(),
          duration: c.duration,
          tweens: [],
          createTween: function(b, c, d) {
            var e = p.Tween(a, j.opts, b, c, j.opts.specialEasing[b] || j.opts.easing);
            return j.tweens.push(e), e
          },
          stop: function(b) {
            var c = 0,
              d = b ? j.tweens.length : 0;
            for (; c < d; c++) j.tweens[c].run(1);
            return b ? h.resolveWith(a, [j, b]) : h.rejectWith(a, [j, b]), this
          }
        }),
        k = j.props;
      cX(k, j.opts.specialEasing);
      for (; e < g; e++) {
        d = cS[e].call(j, a, k, j.opts);
        if (d) return d
      }
      return cV(j, k), p.isFunction(j.opts.start) && j.opts.start.call(a, j), p.fx.timer(p.extend(i, {
        anim: j,
        queue: j.opts.queue,
        elem: a
      })), j.progress(j.opts.progress).done(j.opts.done, j.opts.complete).fail(j.opts.fail).always(j.opts.always)
    }

    function cX(a, b) {
      var c, d, e, f, g;
      for (c in a) {
        d = p.camelCase(c), e = b[d], f = a[c], p.isArray(f) && (e = f[1], f = a[c] = f[0]), c !== d && (a[d] = f, delete a[c]), g = p.cssHooks[d];
        if (g && "expand" in g) {
          f = g.expand(f), delete a[d];
          for (c in f) c in a || (a[c] = f[c], b[c] = e)
        } else b[d] = e
      }
    }

    function cY(a, b, c) {
      var d, e, f, g, h, i, j, k, l = this,
        m = a.style,
        n = {},
        o = [],
        q = a.nodeType && bZ(a);
      c.queue || (j = p._queueHooks(a, "fx"), j.unqueued == null && (j.unqueued = 0, k = j.empty.fire, j.empty.fire = function() {
        j.unqueued || k()
      }), j.unqueued++, l.always(function() {
        l.always(function() {
          j.unqueued--, p.queue(a, "fx").length || j.empty.fire()
        })
      })), a.nodeType === 1 && ("height" in b || "width" in b) && (c.overflow = [m.overflow, m.overflowX, m.overflowY], p.css(a, "display") === "inline" && p.css(a, "float") === "none" && (!p.support.inlineBlockNeedsLayout || cc(a.nodeName) === "inline" ? m.display = "inline-block" : m.zoom = 1)), c.overflow && (m.overflow = "hidden", p.support.shrinkWrapBlocks || l.done(function() {
        m.overflow = c.overflow[0], m.overflowX = c.overflow[1], m.overflowY = c.overflow[2]
      }));
      for (d in b) {
        f = b[d];
        if (cP.exec(f)) {
          delete b[d];
          if (f === (q ? "hide" : "show")) continue;
          o.push(d)
        }
      }
      g = o.length;
      if (g) {
        h = p._data(a, "fxshow") || p._data(a, "fxshow", {}), q ? p(a).show() : l.done(function() {
          p(a).hide()
        }), l.done(function() {
          var b;
          p.removeData(a, "fxshow", !0);
          for (b in n) p.style(a, b, n[b])
        });
        for (d = 0; d < g; d++) e = o[d], i = l.createTween(e, q ? h[e] : 0), n[e] = h[e] || p.style(a, e), e in h || (h[e] = i.start, q && (i.end = i.start, i.start = e === "width" || e === "height" ? 1 : 0))
      }
    }

    function cZ(a, b, c, d, e) {
      return new cZ.prototype.init(a, b, c, d, e)
    }

    function c$(a, b) {
      var c, d = {
          height: a
        },
        e = 0;
      b = b ? 1 : 0;
      for (; e < 4; e += 2 - b) c = bV[e], d["margin" + c] = d["padding" + c] = a;
      return b && (d.opacity = d.width = a), d
    }

    function da(a) {
      return p.isWindow(a) ? a : a.nodeType === 9 ? a.defaultView || a.parentWindow : !1
    }
    var c, d, e = a.document,
      f = a.location,
      g = a.navigator,
      h = a.jQuery,
      i = a.$,
      j = Array.prototype.push,
      k = Array.prototype.slice,
      l = Array.prototype.indexOf,
      m = Object.prototype.toString,
      n = Object.prototype.hasOwnProperty,
      o = String.prototype.trim,
      p = function(a, b) {
        return new p.fn.init(a, b, c)
      },
      q = /[\-+]?(?:\d*\.|)\d+(?:[eE][\-+]?\d+|)/.source,
      r = /\S/,
      s = /\s+/,
      t = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
      u = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,
      v = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
      w = /^[\],:{}\s]*$/,
      x = /(?:^|:|,)(?:\s*\[)+/g,
      y = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
      z = /"[^"\\\r\n]*"|true|false|null|-?(?:\d\d*\.|)\d+(?:[eE][\-+]?\d+|)/g,
      A = /^-ms-/,
      B = /-([\da-z])/gi,
      C = function(a, b) {
        return (b + "").toUpperCase()
      },
      D = function() {
        e.addEventListener ? (e.removeEventListener("DOMContentLoaded", D, !1), p.ready()) : e.readyState === "complete" && (e.detachEvent("onreadystatechange", D), p.ready())
      },
      E = {};
    p.fn = p.prototype = {
      constructor: p,
      init: function(a, c, d) {
        var f, g, h, i;
        if (!a) return this;
        if (a.nodeType) return this.context = this[0] = a, this.length = 1, this;
        if (typeof a == "string") {
          a.charAt(0) === "<" && a.charAt(a.length - 1) === ">" && a.length >= 3 ? f = [null, a, null] : f = u.exec(a);
          if (f && (f[1] || !c)) {
            if (f[1]) return c = c instanceof p ? c[0] : c, i = c && c.nodeType ? c.ownerDocument || c : e, a = p.parseHTML(f[1], i, !0), v.test(f[1]) && p.isPlainObject(c) && this.attr.call(a, c, !0), p.merge(this, a);
            g = e.getElementById(f[2]);
            if (g && g.parentNode) {
              if (g.id !== f[2]) return d.find(a);
              this.length = 1, this[0] = g
            }
            return this.context = e, this.selector = a, this
          }
          return !c || c.jquery ? (c || d).find(a) : this.constructor(c).find(a)
        }
        return p.isFunction(a) ? d.ready(a) : (a.selector !== b && (this.selector = a.selector, this.context = a.context), p.makeArray(a, this))
      },
      selector: "",
      jquery: "1.8.2",
      length: 0,
      size: function() {
        return this.length
      },
      toArray: function() {
        return k.call(this)
      },
      get: function(a) {
        return a == null ? this.toArray() : a < 0 ? this[this.length + a] : this[a]
      },
      pushStack: function(a, b, c) {
        var d = p.merge(this.constructor(), a);
        return d.prevObject = this, d.context = this.context, b === "find" ? d.selector = this.selector + (this.selector ? " " : "") + c : b && (d.selector = this.selector + "." + b + "(" + c + ")"), d
      },
      each: function(a, b) {
        return p.each(this, a, b)
      },
      ready: function(a) {
        return p.ready.promise().done(a), this
      },
      eq: function(a) {
        return a = +a, a === -1 ? this.slice(a) : this.slice(a, a + 1)
      },
      first: function() {
        return this.eq(0)
      },
      last: function() {
        return this.eq(-1)
      },
      slice: function() {
        return this.pushStack(k.apply(this, arguments), "slice", k.call(arguments).join(","))
      },
      map: function(a) {
        return this.pushStack(p.map(this, function(b, c) {
          return a.call(b, c, b)
        }))
      },
      end: function() {
        return this.prevObject || this.constructor(null)
      },
      push: j,
      sort: [].sort,
      splice: [].splice
    }, p.fn.init.prototype = p.fn, p.extend = p.fn.extend = function() {
      var a, c, d, e, f, g, h = arguments[0] || {},
        i = 1,
        j = arguments.length,
        k = !1;
      typeof h == "boolean" && (k = h, h = arguments[1] || {}, i = 2), typeof h != "object" && !p.isFunction(h) && (h = {}), j === i && (h = this, --i);
      for (; i < j; i++)
        if ((a = arguments[i]) != null)
          for (c in a) {
            d = h[c], e = a[c];
            if (h === e) continue;
            k && e && (p.isPlainObject(e) || (f = p.isArray(e))) ? (f ? (f = !1, g = d && p.isArray(d) ? d : []) : g = d && p.isPlainObject(d) ? d : {}, h[c] = p.extend(k, g, e)) : e !== b && (h[c] = e)
          }
      return h
    }, p.extend({
      noConflict: function(b) {
        return a.$ === p && (a.$ = i), b && a.jQuery === p && (a.jQuery = h), p
      },
      isReady: !1,
      readyWait: 1,
      holdReady: function(a) {
        a ? p.readyWait++ : p.ready(!0)
      },
      ready: function(a) {
        if (a === !0 ? --p.readyWait : p.isReady) return;
        if (!e.body) return setTimeout(p.ready, 1);
        p.isReady = !0;
        if (a !== !0 && --p.readyWait > 0) return;
        d.resolveWith(e, [p]), p.fn.trigger && p(e).trigger("ready").off("ready")
      },
      isFunction: function(a) {
        return p.type(a) === "function"
      },
      isArray: Array.isArray || function(a) {
        return p.type(a) === "array"
      },
      isWindow: function(a) {
        return a != null && a == a.window
      },
      isNumeric: function(a) {
        return !isNaN(parseFloat(a)) && isFinite(a)
      },
      type: function(a) {
        return a == null ? String(a) : E[m.call(a)] || "object"
      },
      isPlainObject: function(a) {
        if (!a || p.type(a) !== "object" || a.nodeType || p.isWindow(a)) return !1;
        try {
          if (a.constructor && !n.call(a, "constructor") && !n.call(a.constructor.prototype, "isPrototypeOf")) return !1
        } catch (c) {
          return !1
        }
        var d;
        for (d in a);
        return d === b || n.call(a, d)
      },
      isEmptyObject: function(a) {
        var b;
        for (b in a) return !1;
        return !0
      },
      error: function(a) {
        throw new Error(a)
      },
      parseHTML: function(a, b, c) {
        var d;
        return !a || typeof a != "string" ? null : (typeof b == "boolean" && (c = b, b = 0), b = b || e, (d = v.exec(a)) ? [b.createElement(d[1])] : (d = p.buildFragment([a], b, c ? null : []), p.merge([], (d.cacheable ? p.clone(d.fragment) : d.fragment).childNodes)))
      },
      parseJSON: function(b) {
        if (!b || typeof b != "string") return null;
        b = p.trim(b);
        if (a.JSON && a.JSON.parse) return a.JSON.parse(b);
        if (w.test(b.replace(y, "@").replace(z, "]").replace(x, ""))) return (new Function("return " + b))();
        p.error("Invalid JSON: " + b)
      },
      parseXML: function(c) {
        var d, e;
        if (!c || typeof c != "string") return null;
        try {
          a.DOMParser ? (e = new DOMParser, d = e.parseFromString(c, "text/xml")) : (d = new ActiveXObject("Microsoft.XMLDOM"), d.async = "false", d.loadXML(c))
        } catch (f) {
          d = b
        }
        return (!d || !d.documentElement || d.getElementsByTagName("parsererror").length) && p.error("Invalid XML: " + c), d
      },
      noop: function() {},
      globalEval: function(b) {
        b && r.test(b) && (a.execScript || function(b) {
          a.eval.call(a, b)
        })(b)
      },
      camelCase: function(a) {
        return a.replace(A, "ms-").replace(B, C)
      },
      nodeName: function(a, b) {
        return a.nodeName && a.nodeName.toLowerCase() === b.toLowerCase()
      },
      each: function(a, c, d) {
        var e, f = 0,
          g = a.length,
          h = g === b || p.isFunction(a);
        if (d) {
          if (h) {
            for (e in a)
              if (c.apply(a[e], d) === !1) break
          } else
            for (; f < g;)
              if (c.apply(a[f++], d) === !1) break
        } else if (h) {
          for (e in a)
            if (c.call(a[e], e, a[e]) === !1) break
        } else
          for (; f < g;)
            if (c.call(a[f], f, a[f++]) === !1) break;
        return a
      },
      trim: o && !o.call("﻿ ") ? function(a) {
        return a == null ? "" : o.call(a)
      } : function(a) {
        return a == null ? "" : (a + "").replace(t, "")
      },
      makeArray: function(a, b) {
        var c, d = b || [];
        return a != null && (c = p.type(a), a.length == null || c === "string" || c === "function" || c === "regexp" || p.isWindow(a) ? j.call(d, a) : p.merge(d, a)), d
      },
      inArray: function(a, b, c) {
        var d;
        if (b) {
          if (l) return l.call(b, a, c);
          d = b.length, c = c ? c < 0 ? Math.max(0, d + c) : c : 0;
          for (; c < d; c++)
            if (c in b && b[c] === a) return c
        }
        return -1
      },
      merge: function(a, c) {
        var d = c.length,
          e = a.length,
          f = 0;
        if (typeof d == "number")
          for (; f < d; f++) a[e++] = c[f];
        else
          while (c[f] !== b) a[e++] = c[f++];
        return a.length = e, a
      },
      grep: function(a, b, c) {
        var d, e = [],
          f = 0,
          g = a.length;
        c = !!c;
        for (; f < g; f++) d = !!b(a[f], f), c !== d && e.push(a[f]);
        return e
      },
      map: function(a, c, d) {
        var e, f, g = [],
          h = 0,
          i = a.length,
          j = a instanceof p || i !== b && typeof i == "number" && (i > 0 && a[0] && a[i - 1] || i === 0 || p.isArray(a));
        if (j)
          for (; h < i; h++) e = c(a[h], h, d), e != null && (g[g.length] = e);
        else
          for (f in a) e = c(a[f], f, d), e != null && (g[g.length] = e);
        return g.concat.apply([], g)
      },
      guid: 1,
      proxy: function(a, c) {
        var d, e, f;
        return typeof c == "string" && (d = a[c], c = a, a = d), p.isFunction(a) ? (e = k.call(arguments, 2), f = function() {
          return a.apply(c, e.concat(k.call(arguments)))
        }, f.guid = a.guid = a.guid || p.guid++, f) : b
      },
      access: function(a, c, d, e, f, g, h) {
        var i, j = d == null,
          k = 0,
          l = a.length;
        if (d && typeof d == "object") {
          for (k in d) p.access(a, c, k, d[k], 1, g, e);
          f = 1
        } else if (e !== b) {
          i = h === b && p.isFunction(e), j && (i ? (i = c, c = function(a, b, c) {
            return i.call(p(a), c)
          }) : (c.call(a, e), c = null));
          if (c)
            for (; k < l; k++) c(a[k], d, i ? e.call(a[k], k, c(a[k], d)) : e, h);
          f = 1
        }
        return f ? a : j ? c.call(a) : l ? c(a[0], d) : g
      },
      now: function() {
        return (new Date).getTime()
      }
    }), p.ready.promise = function(b) {
      if (!d) {
        d = p.Deferred();
        if (e.readyState === "complete") setTimeout(p.ready, 1);
        else if (e.addEventListener) e.addEventListener("DOMContentLoaded", D, !1), a.addEventListener("load", p.ready, !1);
        else {
          e.attachEvent("onreadystatechange", D), a.attachEvent("onload", p.ready);
          var c = !1;
          try {
            c = a.frameElement == null && e.documentElement
          } catch (f) {}
          c && c.doScroll && function g() {
            if (!p.isReady) {
              try {
                c.doScroll("left")
              } catch (a) {
                return setTimeout(g, 50)
              }
              p.ready()
            }
          }()
        }
      }
      return d.promise(b)
    }, p.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(a, b) {
      E["[object " + b + "]"] = b.toLowerCase()
    }), c = p(e);
    var F = {};
    p.Callbacks = function(a) {
      a = typeof a == "string" ? F[a] || G(a) : p.extend({}, a);
      var c, d, e, f, g, h, i = [],
        j = !a.once && [],
        k = function(b) {
          c = a.memory && b, d = !0, h = f || 0, f = 0, g = i.length, e = !0;
          for (; i && h < g; h++)
            if (i[h].apply(b[0], b[1]) === !1 && a.stopOnFalse) {
              c = !1;
              break
            }
          e = !1, i && (j ? j.length && k(j.shift()) : c ? i = [] : l.disable())
        },
        l = {
          add: function() {
            if (i) {
              var b = i.length;
              (function d(b) {
                p.each(b, function(b, c) {
                  var e = p.type(c);
                  e === "function" && (!a.unique || !l.has(c)) ? i.push(c) : c && c.length && e !== "string" && d(c)
                })
              })(arguments), e ? g = i.length : c && (f = b, k(c))
            }
            return this
          },
          remove: function() {
            return i && p.each(arguments, function(a, b) {
              var c;
              while ((c = p.inArray(b, i, c)) > -1) i.splice(c, 1), e && (c <= g && g--, c <= h && h--)
            }), this
          },
          has: function(a) {
            return p.inArray(a, i) > -1
          },
          empty: function() {
            return i = [], this
          },
          disable: function() {
            return i = j = c = b, this
          },
          disabled: function() {
            return !i
          },
          lock: function() {
            return j = b, c || l.disable(), this
          },
          locked: function() {
            return !j
          },
          fireWith: function(a, b) {
            return b = b || [], b = [a, b.slice ? b.slice() : b], i && (!d || j) && (e ? j.push(b) : k(b)), this
          },
          fire: function() {
            return l.fireWith(this, arguments), this
          },
          fired: function() {
            return !!d
          }
        };
      return l
    }, p.extend({
      Deferred: function(a) {
        var b = [
            ["resolve", "done", p.Callbacks("once memory"), "resolved"],
            ["reject", "fail", p.Callbacks("once memory"), "rejected"],
            ["notify", "progress", p.Callbacks("memory")]
          ],
          c = "pending",
          d = {
            state: function() {
              return c
            },
            always: function() {
              return e.done(arguments).fail(arguments), this
            },
            then: function() {
              var a = arguments;
              return p.Deferred(function(c) {
                p.each(b, function(b, d) {
                  var f = d[0],
                    g = a[b];
                  e[d[1]](p.isFunction(g) ? function() {
                    var a = g.apply(this, arguments);
                    a && p.isFunction(a.promise) ? a.promise().done(c.resolve).fail(c.reject).progress(c.notify) : c[f + "With"](this === e ? c : this, [a])
                  } : c[f])
                }), a = null
              }).promise()
            },
            promise: function(a) {
              return a != null ? p.extend(a, d) : d
            }
          },
          e = {};
        return d.pipe = d.then, p.each(b, function(a, f) {
          var g = f[2],
            h = f[3];
          d[f[1]] = g.add, h && g.add(function() {
            c = h
          }, b[a ^ 1][2].disable, b[2][2].lock), e[f[0]] = g.fire, e[f[0] + "With"] = g.fireWith
        }), d.promise(e), a && a.call(e, e), e
      },
      when: function(a) {
        var b = 0,
          c = k.call(arguments),
          d = c.length,
          e = d !== 1 || a && p.isFunction(a.promise) ? d : 0,
          f = e === 1 ? a : p.Deferred(),
          g = function(a, b, c) {
            return function(d) {
              b[a] = this, c[a] = arguments.length > 1 ? k.call(arguments) : d, c === h ? f.notifyWith(b, c) : --e || f.resolveWith(b, c)
            }
          },
          h, i, j;
        if (d > 1) {
          h = new Array(d), i = new Array(d), j = new Array(d);
          for (; b < d; b++) c[b] && p.isFunction(c[b].promise) ? c[b].promise().done(g(b, j, c)).fail(f.reject).progress(g(b, i, h)) : --e
        }
        return e || f.resolveWith(j, c), f.promise()
      }
    }), p.support = function() {
      var b, c, d, f, g, h, i, j, k, l, m, n = e.createElement("div");
      n.setAttribute("className", "t"), n.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", c = n.getElementsByTagName("*"), d = n.getElementsByTagName("a")[0], d.style.cssText = "top:1px;float:left;opacity:.5";
      if (!c || !c.length) return {};
      f = e.createElement("select"), g = f.appendChild(e.createElement("option")), h = n.getElementsByTagName("input")[0], b = {
        leadingWhitespace: n.firstChild.nodeType === 3,
        tbody: !n.getElementsByTagName("tbody").length,
        htmlSerialize: !!n.getElementsByTagName("link").length,
        style: /top/.test(d.getAttribute("style")),
        hrefNormalized: d.getAttribute("href") === "/a",
        opacity: /^0.5/.test(d.style.opacity),
        cssFloat: !!d.style.cssFloat,
        checkOn: h.value === "on",
        optSelected: g.selected,
        getSetAttribute: n.className !== "t",
        enctype: !!e.createElement("form").enctype,
        html5Clone: e.createElement("nav").cloneNode(!0).outerHTML !== "<:nav></:nav>",
        boxModel: e.compatMode === "CSS1Compat",
        submitBubbles: !0,
        changeBubbles: !0,
        focusinBubbles: !1,
        deleteExpando: !0,
        noCloneEvent: !0,
        inlineBlockNeedsLayout: !1,
        shrinkWrapBlocks: !1,
        reliableMarginRight: !0,
        boxSizingReliable: !0,
        pixelPosition: !1
      }, h.checked = !0, b.noCloneChecked = h.cloneNode(!0).checked, f.disabled = !0, b.optDisabled = !g.disabled;
      try {
        delete n.test
      } catch (o) {
        b.deleteExpando = !1
      }!n.addEventListener && n.attachEvent && n.fireEvent && (n.attachEvent("onclick", m = function() {
        b.noCloneEvent = !1
      }), n.cloneNode(!0).fireEvent("onclick"), n.detachEvent("onclick", m)), h = e.createElement("input"), h.value = "t", h.setAttribute("type", "radio"), b.radioValue = h.value === "t", h.setAttribute("checked", "checked"), h.setAttribute("name", "t"), n.appendChild(h), i = e.createDocumentFragment(), i.appendChild(n.lastChild), b.checkClone = i.cloneNode(!0).cloneNode(!0).lastChild.checked, b.appendChecked = h.checked, i.removeChild(h), i.appendChild(n);
      if (n.attachEvent)
        for (k in {
            submit: !0,
            change: !0,
            focusin: !0
          }) j = "on" + k, l = j in n, l || (n.setAttribute(j, "return;"), l = typeof n[j] == "function"), b[k + "Bubbles"] = l;
      return p(function() {
        var c, d, f, g, h = "padding:0;margin:0;border:0;display:block;overflow:hidden;",
          i = e.getElementsByTagName("body")[0];
        if (!i) return;
        c = e.createElement("div"), c.style.cssText = "visibility:hidden;border:0;width:0;height:0;position:static;top:0;margin-top:1px", i.insertBefore(c, i.firstChild), d = e.createElement("div"), c.appendChild(d), d.innerHTML = "<table><tr><td></td><td>t</td></tr></table>", f = d.getElementsByTagName("td"), f[0].style.cssText = "padding:0;margin:0;border:0;display:none", l = f[0].offsetHeight === 0, f[0].style.display = "", f[1].style.display = "none", b.reliableHiddenOffsets = l && f[0].offsetHeight === 0, d.innerHTML = "", d.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;", b.boxSizing = d.offsetWidth === 4, b.doesNotIncludeMarginInBodyOffset = i.offsetTop !== 1, a.getComputedStyle && (b.pixelPosition = (a.getComputedStyle(d, null) || {}).top !== "1%", b.boxSizingReliable = (a.getComputedStyle(d, null) || {
          width: "4px"
        }).width === "4px", g = e.createElement("div"), g.style.cssText = d.style.cssText = h, g.style.marginRight = g.style.width = "0", d.style.width = "1px", d.appendChild(g), b.reliableMarginRight = !parseFloat((a.getComputedStyle(g, null) || {}).marginRight)), typeof d.style.zoom != "undefined" && (d.innerHTML = "", d.style.cssText = h + "width:1px;padding:1px;display:inline;zoom:1", b.inlineBlockNeedsLayout = d.offsetWidth === 3, d.style.display = "block", d.style.overflow = "visible", d.innerHTML = "<div></div>", d.firstChild.style.width = "5px", b.shrinkWrapBlocks = d.offsetWidth !== 3, c.style.zoom = 1), i.removeChild(c), c = d = f = g = null
      }), i.removeChild(n), c = d = f = g = h = i = n = null, b
    }();
    var H = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
      I = /([A-Z])/g;
    p.extend({
      cache: {},
      deletedIds: [],
      uuid: 0,
      expando: "jQuery" + (p.fn.jquery + Math.random()).replace(/\D/g, ""),
      noData: {
        embed: !0,
        object: "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
        applet: !0
      },
      hasData: function(a) {
        return a = a.nodeType ? p.cache[a[p.expando]] : a[p.expando], !!a && !K(a)
      },
      data: function(a, c, d, e) {
        if (!p.acceptData(a)) return;
        var f, g, h = p.expando,
          i = typeof c == "string",
          j = a.nodeType,
          k = j ? p.cache : a,
          l = j ? a[h] : a[h] && h;
        if ((!l || !k[l] || !e && !k[l].data) && i && d === b) return;
        l || (j ? a[h] = l = p.deletedIds.pop() || p.guid++ : l = h), k[l] || (k[l] = {}, j || (k[l].toJSON = p.noop));
        if (typeof c == "object" || typeof c == "function") e ? k[l] = p.extend(k[l], c) : k[l].data = p.extend(k[l].data, c);
        return f = k[l], e || (f.data || (f.data = {}), f = f.data), d !== b && (f[p.camelCase(c)] = d), i ? (g = f[c], g == null && (g = f[p.camelCase(c)])) : g = f, g
      },
      removeData: function(a, b, c) {
        if (!p.acceptData(a)) return;
        var d, e, f, g = a.nodeType,
          h = g ? p.cache : a,
          i = g ? a[p.expando] : p.expando;
        if (!h[i]) return;
        if (b) {
          d = c ? h[i] : h[i].data;
          if (d) {
            p.isArray(b) || (b in d ? b = [b] : (b = p.camelCase(b), b in d ? b = [b] : b = b.split(" ")));
            for (e = 0, f = b.length; e < f; e++) delete d[b[e]];
            if (!(c ? K : p.isEmptyObject)(d)) return
          }
        }
        if (!c) {
          delete h[i].data;
          if (!K(h[i])) return
        }
        g ? p.cleanData([a], !0) : p.support.deleteExpando || h != h.window ? delete h[i] : h[i] = null
      },
      _data: function(a, b, c) {
        return p.data(a, b, c, !0)
      },
      acceptData: function(a) {
        var b = a.nodeName && p.noData[a.nodeName.toLowerCase()];
        return !b || b !== !0 && a.getAttribute("classid") === b
      }
    }), p.fn.extend({
      data: function(a, c) {
        var d, e, f, g, h, i = this[0],
          j = 0,
          k = null;
        if (a === b) {
          if (this.length) {
            k = p.data(i);
            if (i.nodeType === 1 && !p._data(i, "parsedAttrs")) {
              f = i.attributes;
              for (h = f.length; j < h; j++) g = f[j].name, g.indexOf("data-") || (g = p.camelCase(g.substring(5)), J(i, g, k[g]));
              p._data(i, "parsedAttrs", !0)
            }
          }
          return k
        }
        return typeof a == "object" ? this.each(function() {
          p.data(this, a)
        }) : (d = a.split(".", 2), d[1] = d[1] ? "." + d[1] : "", e = d[1] + "!", p.access(this, function(c) {
          if (c === b) return k = this.triggerHandler("getData" + e, [d[0]]), k === b && i && (k = p.data(i, a), k = J(i, a, k)), k === b && d[1] ? this.data(d[0]) : k;
          d[1] = c, this.each(function() {
            var b = p(this);
            b.triggerHandler("setData" + e, d), p.data(this, a, c), b.triggerHandler("changeData" + e, d)
          })
        }, null, c, arguments.length > 1, null, !1))
      },
      removeData: function(a) {
        return this.each(function() {
          p.removeData(this, a)
        })
      }
    }), p.extend({
      queue: function(a, b, c) {
        var d;
        if (a) return b = (b || "fx") + "queue", d = p._data(a, b), c && (!d || p.isArray(c) ? d = p._data(a, b, p.makeArray(c)) : d.push(c)), d || []
      },
      dequeue: function(a, b) {
        b = b || "fx";
        var c = p.queue(a, b),
          d = c.length,
          e = c.shift(),
          f = p._queueHooks(a, b),
          g = function() {
            p.dequeue(a, b)
          };
        e === "inprogress" && (e = c.shift(), d--), e && (b === "fx" && c.unshift("inprogress"), delete f.stop, e.call(a, g, f)), !d && f && f.empty.fire()
      },
      _queueHooks: function(a, b) {
        var c = b + "queueHooks";
        return p._data(a, c) || p._data(a, c, {
          empty: p.Callbacks("once memory").add(function() {
            p.removeData(a, b + "queue", !0), p.removeData(a, c, !0)
          })
        })
      }
    }), p.fn.extend({
      queue: function(a, c) {
        var d = 2;
        return typeof a != "string" && (c = a, a = "fx", d--), arguments.length < d ? p.queue(this[0], a) : c === b ? this : this.each(function() {
          var b = p.queue(this, a, c);
          p._queueHooks(this, a), a === "fx" && b[0] !== "inprogress" && p.dequeue(this, a)
        })
      },
      dequeue: function(a) {
        return this.each(function() {
          p.dequeue(this, a)
        })
      },
      delay: function(a, b) {
        return a = p.fx ? p.fx.speeds[a] || a : a, b = b || "fx", this.queue(b, function(b, c) {
          var d = setTimeout(b, a);
          c.stop = function() {
            clearTimeout(d)
          }
        })
      },
      clearQueue: function(a) {
        return this.queue(a || "fx", [])
      },
      promise: function(a, c) {
        var d, e = 1,
          f = p.Deferred(),
          g = this,
          h = this.length,
          i = function() {
            --e || f.resolveWith(g, [g])
          };
        typeof a != "string" && (c = a, a = b), a = a || "fx";
        while (h--) d = p._data(g[h], a + "queueHooks"), d && d.empty && (e++, d.empty.add(i));
        return i(), f.promise(c)
      }
    });
    var L, M, N, O = /[\t\r\n]/g,
      P = /\r/g,
      Q = /^(?:button|input)$/i,
      R = /^(?:button|input|object|select|textarea)$/i,
      S = /^a(?:rea|)$/i,
      T = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,
      U = p.support.getSetAttribute;
    p.fn.extend({
      attr: function(a, b) {
        return p.access(this, p.attr, a, b, arguments.length > 1)
      },
      removeAttr: function(a) {
        return this.each(function() {
          p.removeAttr(this, a)
        })
      },
      prop: function(a, b) {
        return p.access(this, p.prop, a, b, arguments.length > 1)
      },
      removeProp: function(a) {
        return a = p.propFix[a] || a, this.each(function() {
          try {
            this[a] = b, delete this[a]
          } catch (c) {}
        })
      },
      addClass: function(a) {
        var b, c, d, e, f, g, h;
        if (p.isFunction(a)) return this.each(function(b) {
          p(this).addClass(a.call(this, b, this.className))
        });
        if (a && typeof a == "string") {
          b = a.split(s);
          for (c = 0, d = this.length; c < d; c++) {
            e = this[c];
            if (e.nodeType === 1)
              if (!e.className && b.length === 1) e.className = a;
              else {
                f = " " + e.className + " ";
                for (g = 0, h = b.length; g < h; g++) f.indexOf(" " + b[g] + " ") < 0 && (f += b[g] + " ");
                e.className = p.trim(f)
              }
          }
        }
        return this
      },
      removeClass: function(a) {
        var c, d, e, f, g, h, i;
        if (p.isFunction(a)) return this.each(function(b) {
          p(this).removeClass(a.call(this, b, this.className))
        });
        if (a && typeof a == "string" || a === b) {
          c = (a || "").split(s);
          for (h = 0, i = this.length; h < i; h++) {
            e = this[h];
            if (e.nodeType === 1 && e.className) {
              d = (" " + e.className + " ").replace(O, " ");
              for (f = 0, g = c.length; f < g; f++)
                while (d.indexOf(" " + c[f] + " ") >= 0) d = d.replace(" " + c[f] + " ", " ");
              e.className = a ? p.trim(d) : ""
            }
          }
        }
        return this
      },
      toggleClass: function(a, b) {
        var c = typeof a,
          d = typeof b == "boolean";
        return p.isFunction(a) ? this.each(function(c) {
          p(this).toggleClass(a.call(this, c, this.className, b), b)
        }) : this.each(function() {
          if (c === "string") {
            var e, f = 0,
              g = p(this),
              h = b,
              i = a.split(s);
            while (e = i[f++]) h = d ? h : !g.hasClass(e), g[h ? "addClass" : "removeClass"](e)
          } else if (c === "undefined" || c === "boolean") this.className && p._data(this, "__className__", this.className), this.className = this.className || a === !1 ? "" : p._data(this, "__className__") || ""
        })
      },
      hasClass: function(a) {
        var b = " " + a + " ",
          c = 0,
          d = this.length;
        for (; c < d; c++)
          if (this[c].nodeType === 1 && (" " + this[c].className + " ").replace(O, " ").indexOf(b) >= 0) return !0;
        return !1
      },
      val: function(a) {
        var c, d, e, f = this[0];
        if (!arguments.length) {
          if (f) return c = p.valHooks[f.type] || p.valHooks[f.nodeName.toLowerCase()], c && "get" in c && (d = c.get(f, "value")) !== b ? d : (d = f.value, typeof d == "string" ? d.replace(P, "") : d == null ? "" : d);
          return
        }
        return e = p.isFunction(a), this.each(function(d) {
          var f, g = p(this);
          if (this.nodeType !== 1) return;
          e ? f = a.call(this, d, g.val()) : f = a, f == null ? f = "" : typeof f == "number" ? f += "" : p.isArray(f) && (f = p.map(f, function(a) {
            return a == null ? "" : a + ""
          })), c = p.valHooks[this.type] || p.valHooks[this.nodeName.toLowerCase()];
          if (!c || !("set" in c) || c.set(this, f, "value") === b) this.value = f
        })
      }
    }), p.extend({
      valHooks: {
        option: {
          get: function(a) {
            var b = a.attributes.value;
            return !b || b.specified ? a.value : a.text
          }
        },
        select: {
          get: function(a) {
            var b, c, d, e, f = a.selectedIndex,
              g = [],
              h = a.options,
              i = a.type === "select-one";
            if (f < 0) return null;
            c = i ? f : 0, d = i ? f + 1 : h.length;
            for (; c < d; c++) {
              e = h[c];
              if (e.selected && (p.support.optDisabled ? !e.disabled : e.getAttribute("disabled") === null) && (!e.parentNode.disabled || !p.nodeName(e.parentNode, "optgroup"))) {
                b = p(e).val();
                if (i) return b;
                g.push(b)
              }
            }
            return i && !g.length && h.length ? p(h[f]).val() : g
          },
          set: function(a, b) {
            var c = p.makeArray(b);
            return p(a).find("option").each(function() {
              this.selected = p.inArray(p(this).val(), c) >= 0
            }), c.length || (a.selectedIndex = -1), c
          }
        }
      },
      attrFn: {},
      attr: function(a, c, d, e) {
        var f, g, h, i = a.nodeType;
        if (!a || i === 3 || i === 8 || i === 2) return;
        if (e && p.isFunction(p.fn[c])) return p(a)[c](d);
        if (typeof a.getAttribute == "undefined") return p.prop(a, c, d);
        h = i !== 1 || !p.isXMLDoc(a), h && (c = c.toLowerCase(), g = p.attrHooks[c] || (T.test(c) ? M : L));
        if (d !== b) {
          if (d === null) {
            p.removeAttr(a, c);
            return
          }
          return g && "set" in g && h && (f = g.set(a, d, c)) !== b ? f : (a.setAttribute(c, d + ""), d)
        }
        return g && "get" in g && h && (f = g.get(a, c)) !== null ? f : (f = a.getAttribute(c), f === null ? b : f)
      },
      removeAttr: function(a, b) {
        var c, d, e, f, g = 0;
        if (b && a.nodeType === 1) {
          d = b.split(s);
          for (; g < d.length; g++) e = d[g], e && (c = p.propFix[e] || e, f = T.test(e), f || p.attr(a, e, ""), a.removeAttribute(U ? e : c), f && c in a && (a[c] = !1))
        }
      },
      attrHooks: {
        type: {
          set: function(a, b) {
            if (Q.test(a.nodeName) && a.parentNode) p.error("type property can't be changed");
            else if (!p.support.radioValue && b === "radio" && p.nodeName(a, "input")) {
              var c = a.value;
              return a.setAttribute("type", b), c && (a.value = c), b
            }
          }
        },
        value: {
          get: function(a, b) {
            return L && p.nodeName(a, "button") ? L.get(a, b) : b in a ? a.value : null
          },
          set: function(a, b, c) {
            if (L && p.nodeName(a, "button")) return L.set(a, b, c);
            a.value = b
          }
        }
      },
      propFix: {
        tabindex: "tabIndex",
        readonly: "readOnly",
        "for": "htmlFor",
        "class": "className",
        maxlength: "maxLength",
        cellspacing: "cellSpacing",
        cellpadding: "cellPadding",
        rowspan: "rowSpan",
        colspan: "colSpan",
        usemap: "useMap",
        frameborder: "frameBorder",
        contenteditable: "contentEditable"
      },
      prop: function(a, c, d) {
        var e, f, g, h = a.nodeType;
        if (!a || h === 3 || h === 8 || h === 2) return;
        return g = h !== 1 || !p.isXMLDoc(a), g && (c = p.propFix[c] || c, f = p.propHooks[c]), d !== b ? f && "set" in f && (e = f.set(a, d, c)) !== b ? e : a[c] = d : f && "get" in f && (e = f.get(a, c)) !== null ? e : a[c]
      },
      propHooks: {
        tabIndex: {
          get: function(a) {
            var c = a.getAttributeNode("tabindex");
            return c && c.specified ? parseInt(c.value, 10) : R.test(a.nodeName) || S.test(a.nodeName) && a.href ? 0 : b
          }
        }
      }
    }), M = {
      get: function(a, c) {
        var d, e = p.prop(a, c);
        return e === !0 || typeof e != "boolean" && (d = a.getAttributeNode(c)) && d.nodeValue !== !1 ? c.toLowerCase() : b
      },
      set: function(a, b, c) {
        var d;
        return b === !1 ? p.removeAttr(a, c) : (d = p.propFix[c] || c, d in a && (a[d] = !0), a.setAttribute(c, c.toLowerCase())), c
      }
    }, U || (N = {
      name: !0,
      id: !0,
      coords: !0
    }, L = p.valHooks.button = {
      get: function(a, c) {
        var d;
        return d = a.getAttributeNode(c), d && (N[c] ? d.value !== "" : d.specified) ? d.value : b
      },
      set: function(a, b, c) {
        var d = a.getAttributeNode(c);
        return d || (d = e.createAttribute(c), a.setAttributeNode(d)), d.value = b + ""
      }
    }, p.each(["width", "height"], function(a, b) {
      p.attrHooks[b] = p.extend(p.attrHooks[b], {
        set: function(a, c) {
          if (c === "") return a.setAttribute(b, "auto"), c
        }
      })
    }), p.attrHooks.contenteditable = {
      get: L.get,
      set: function(a, b, c) {
        b === "" && (b = "false"), L.set(a, b, c)
      }
    }), p.support.hrefNormalized || p.each(["href", "src", "width", "height"], function(a, c) {
      p.attrHooks[c] = p.extend(p.attrHooks[c], {
        get: function(a) {
          var d = a.getAttribute(c, 2);
          return d === null ? b : d
        }
      })
    }), p.support.style || (p.attrHooks.style = {
      get: function(a) {
        return a.style.cssText.toLowerCase() || b
      },
      set: function(a, b) {
        return a.style.cssText = b + ""
      }
    }), p.support.optSelected || (p.propHooks.selected = p.extend(p.propHooks.selected, {
      get: function(a) {
        var b = a.parentNode;
        return b && (b.selectedIndex, b.parentNode && b.parentNode.selectedIndex), null
      }
    })), p.support.enctype || (p.propFix.enctype = "encoding"), p.support.checkOn || p.each(["radio", "checkbox"], function() {
      p.valHooks[this] = {
        get: function(a) {
          return a.getAttribute("value") === null ? "on" : a.value
        }
      }
    }), p.each(["radio", "checkbox"], function() {
      p.valHooks[this] = p.extend(p.valHooks[this], {
        set: function(a, b) {
          if (p.isArray(b)) return a.checked = p.inArray(p(a).val(), b) >= 0
        }
      })
    });
    var V = /^(?:textarea|input|select)$/i,
      W = /^([^\.]*|)(?:\.(.+)|)$/,
      X = /(?:^|\s)hover(\.\S+|)\b/,
      Y = /^key/,
      Z = /^(?:mouse|contextmenu)|click/,
      $ = /^(?:focusinfocus|focusoutblur)$/,
      _ = function(a) {
        return p.event.special.hover ? a : a.replace(X, "mouseenter$1 mouseleave$1")
      };
    p.event = {
        add: function(a, c, d, e, f) {
          var g, h, i, j, k, l, m, n, o, q, r;
          if (a.nodeType === 3 || a.nodeType === 8 || !c || !d || !(g = p._data(a))) return;
          d.handler && (o = d, d = o.handler, f = o.selector), d.guid || (d.guid = p.guid++), i = g.events, i || (g.events = i = {}), h = g.handle, h || (g.handle = h = function(a) {
            return typeof p != "undefined" && (!a || p.event.triggered !== a.type) ? p.event.dispatch.apply(h.elem, arguments) : b
          }, h.elem = a), c = p.trim(_(c)).split(" ");
          for (j = 0; j < c.length; j++) {
            k = W.exec(c[j]) || [], l = k[1], m = (k[2] || "").split(".").sort(), r = p.event.special[l] || {}, l = (f ? r.delegateType : r.bindType) || l, r = p.event.special[l] || {}, n = p.extend({
              type: l,
              origType: k[1],
              data: e,
              handler: d,
              guid: d.guid,
              selector: f,
              needsContext: f && p.expr.match.needsContext.test(f),
              namespace: m.join(".")
            }, o), q = i[l];
            if (!q) {
              q = i[l] = [], q.delegateCount = 0;
              if (!r.setup || r.setup.call(a, e, m, h) === !1) a.addEventListener ? a.addEventListener(l, h, !1) : a.attachEvent && a.attachEvent("on" + l, h)
            }
            r.add && (r.add.call(a, n), n.handler.guid || (n.handler.guid = d.guid)), f ? q.splice(q.delegateCount++, 0, n) : q.push(n), p.event.global[l] = !0
          }
          a = null
        },
        global: {},
        remove: function(a, b, c, d, e) {
          var f, g, h, i, j, k, l, m, n, o, q, r = p.hasData(a) && p._data(a);
          if (!r || !(m = r.events)) return;
          b = p.trim(_(b || "")).split(" ");
          for (f = 0; f < b.length; f++) {
            g = W.exec(b[f]) || [], h = i = g[1], j = g[2];
            if (!h) {
              for (h in m) p.event.remove(a, h + b[f], c, d, !0);
              continue
            }
            n = p.event.special[h] || {}, h = (d ? n.delegateType : n.bindType) || h, o = m[h] || [], k = o.length, j = j ? new RegExp("(^|\\.)" + j.split(".").sort().join("\\.(?:.*\\.|)") + "(\\.|$)") : null;
            for (l = 0; l < o.length; l++) q = o[l], (e || i === q.origType) && (!c || c.guid === q.guid) && (!j || j.test(q.namespace)) && (!d || d === q.selector || d === "**" && q.selector) && (o.splice(l--, 1), q.selector && o.delegateCount--, n.remove && n.remove.call(a, q));
            o.length === 0 && k !== o.length && ((!n.teardown || n.teardown.call(a, j, r.handle) === !1) && p.removeEvent(a, h, r.handle), delete m[h])
          }
          p.isEmptyObject(m) && (delete r.handle, p.removeData(a, "events", !0))
        },
        customEvent: {
          getData: !0,
          setData: !0,
          changeData: !0
        },
        trigger: function(c, d, f, g) {
          if (!f || f.nodeType !== 3 && f.nodeType !== 8) {
            var h, i, j, k, l, m, n, o, q, r, s = c.type || c,
              t = [];
            if ($.test(s + p.event.triggered)) return;
            s.indexOf("!") >= 0 && (s = s.slice(0, -1), i = !0), s.indexOf(".") >= 0 && (t = s.split("."), s = t.shift(), t.sort());
            if ((!f || p.event.customEvent[s]) && !p.event.global[s]) return;
            c = typeof c == "object" ? c[p.expando] ? c : new p.Event(s, c) : new p.Event(s), c.type = s, c.isTrigger = !0, c.exclusive = i, c.namespace = t.join("."), c.namespace_re = c.namespace ? new RegExp("(^|\\.)" + t.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, m = s.indexOf(":") < 0 ? "on" + s : "";
            if (!f) {
              h = p.cache;
              for (j in h) h[j].events && h[j].events[s] && p.event.trigger(c, d, h[j].handle.elem, !0);
              return
            }
            c.result = b, c.target || (c.target = f), d = d != null ? p.makeArray(d) : [], d.unshift(c), n = p.event.special[s] || {};
            if (n.trigger && n.trigger.apply(f, d) === !1) return;
            q = [
              [f, n.bindType || s]
            ];
            if (!g && !n.noBubble && !p.isWindow(f)) {
              r = n.delegateType || s, k = $.test(r + s) ? f : f.parentNode;
              for (l = f; k; k = k.parentNode) q.push([k, r]), l = k;
              l === (f.ownerDocument || e) && q.push([l.defaultView || l.parentWindow || a, r])
            }
            for (j = 0; j < q.length && !c.isPropagationStopped(); j++) k = q[j][0], c.type = q[j][1], o = (p._data(k, "events") || {})[c.type] && p._data(k, "handle"), o && o.apply(k, d), o = m && k[m], o && p.acceptData(k) && o.apply && o.apply(k, d) === !1 && c.preventDefault();
            return c.type = s, !g && !c.isDefaultPrevented() && (!n._default || n._default.apply(f.ownerDocument, d) === !1) && (s !== "click" || !p.nodeName(f, "a")) && p.acceptData(f) && m && f[s] && (s !== "focus" && s !== "blur" || c.target.offsetWidth !== 0) && !p.isWindow(f) && (l = f[m], l && (f[m] = null), p.event.triggered = s, f[s](), p.event.triggered = b, l && (f[m] = l)), c.result
          }
          return
        },
        dispatch: function(c) {
          c = p.event.fix(c || a.event);
          var d, e, f, g, h, i, j, l, m, n, o = (p._data(this, "events") || {})[c.type] || [],
            q = o.delegateCount,
            r = k.call(arguments),
            s = !c.exclusive && !c.namespace,
            t = p.event.special[c.type] || {},
            u = [];
          r[0] = c, c.delegateTarget = this;
          if (t.preDispatch && t.preDispatch.call(this, c) === !1) return;
          if (q && (!c.button || c.type !== "click"))
            for (f = c.target; f != this; f = f.parentNode || this)
              if (f.disabled !== !0 || c.type !== "click") {
                h = {}, j = [];
                for (d = 0; d < q; d++) l = o[d], m = l.selector, h[m] === b && (h[m] = l.needsContext ? p(m, this).index(f) >= 0 : p.find(m, this, null, [f]).length), h[m] && j.push(l);
                j.length && u.push({
                  elem: f,
                  matches: j
                })
              }
          o.length > q && u.push({
            elem: this,
            matches: o.slice(q)
          });
          for (d = 0; d < u.length && !c.isPropagationStopped(); d++) {
            i = u[d], c.currentTarget = i.elem;
            for (e = 0; e < i.matches.length && !c.isImmediatePropagationStopped(); e++) {
              l = i.matches[e];
              if (s || !c.namespace && !l.namespace || c.namespace_re && c.namespace_re.test(l.namespace)) c.data = l.data, c.handleObj = l, g = ((p.event.special[l.origType] || {}).handle || l.handler).apply(i.elem, r), g !== b && (c.result = g, g === !1 && (c.preventDefault(), c.stopPropagation()))
            }
          }
          return t.postDispatch && t.postDispatch.call(this, c), c.result
        },
        props: "attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
        fixHooks: {},
        keyHooks: {
          props: "char charCode key keyCode".split(" "),
          filter: function(a, b) {
            return a.which == null && (a.which = b.charCode != null ? b.charCode : b.keyCode), a
          }
        },
        mouseHooks: {
          props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
          filter: function(a, c) {
            var d, f, g, h = c.button,
              i = c.fromElement;
            return a.pageX == null && c.clientX != null && (d = a.target.ownerDocument || e, f = d.documentElement, g = d.body, a.pageX = c.clientX + (f && f.scrollLeft || g && g.scrollLeft || 0) - (f && f.clientLeft || g && g.clientLeft || 0), a.pageY = c.clientY + (f && f.scrollTop || g && g.scrollTop || 0) - (f && f.clientTop || g && g.clientTop || 0)), !a.relatedTarget && i && (a.relatedTarget = i === a.target ? c.toElement : i), !a.which && h !== b && (a.which = h & 1 ? 1 : h & 2 ? 3 : h & 4 ? 2 : 0), a
          }
        },
        fix: function(a) {
          if (a[p.expando]) return a;
          var b, c, d = a,
            f = p.event.fixHooks[a.type] || {},
            g = f.props ? this.props.concat(f.props) : this.props;
          a = p.Event(d);
          for (b = g.length; b;) c = g[--b], a[c] = d[c];
          return a.target || (a.target = d.srcElement || e), a.target.nodeType === 3 && (a.target = a.target.parentNode), a.metaKey = !!a.metaKey, f.filter ? f.filter(a, d) : a
        },
        special: {
          load: {
            noBubble: !0
          },
          focus: {
            delegateType: "focusin"
          },
          blur: {
            delegateType: "focusout"
          },
          beforeunload: {
            setup: function(a, b, c) {
              p.isWindow(this) && (this.onbeforeunload = c)
            },
            teardown: function(a, b) {
              this.onbeforeunload === b && (this.onbeforeunload = null)
            }
          }
        },
        simulate: function(a, b, c, d) {
          var e = p.extend(new p.Event, c, {
            type: a,
            isSimulated: !0,
            originalEvent: {}
          });
          d ? p.event.trigger(e, null, b) : p.event.dispatch.call(b, e), e.isDefaultPrevented() && c.preventDefault()
        }
      }, p.event.handle = p.event.dispatch, p.removeEvent = e.removeEventListener ? function(a, b, c) {
        a.removeEventListener && a.removeEventListener(b, c, !1)
      } : function(a, b, c) {
        var d = "on" + b;
        a.detachEvent && (typeof a[d] == "undefined" && (a[d] = null), a.detachEvent(d, c))
      }, p.Event = function(a, b) {
        if (this instanceof p.Event) a && a.type ? (this.originalEvent = a, this.type = a.type, this.isDefaultPrevented = a.defaultPrevented || a.returnValue === !1 || a.getPreventDefault && a.getPreventDefault() ? bb : ba) : this.type = a, b && p.extend(this, b), this.timeStamp = a && a.timeStamp || p.now(), this[p.expando] = !0;
        else return new p.Event(a, b)
      }, p.Event.prototype = {
        preventDefault: function() {
          this.isDefaultPrevented = bb;
          var a = this.originalEvent;
          if (!a) return;
          a.preventDefault ? a.preventDefault() : a.returnValue = !1
        },
        stopPropagation: function() {
          this.isPropagationStopped = bb;
          var a = this.originalEvent;
          if (!a) return;
          a.stopPropagation && a.stopPropagation(), a.cancelBubble = !0
        },
        stopImmediatePropagation: function() {
          this.isImmediatePropagationStopped = bb, this.stopPropagation()
        },
        isDefaultPrevented: ba,
        isPropagationStopped: ba,
        isImmediatePropagationStopped: ba
      }, p.each({
        mouseenter: "mouseover",
        mouseleave: "mouseout"
      }, function(a, b) {
        p.event.special[a] = {
          delegateType: b,
          bindType: b,
          handle: function(a) {
            var c, d = this,
              e = a.relatedTarget,
              f = a.handleObj,
              g = f.selector;
            if (!e || e !== d && !p.contains(d, e)) a.type = f.origType, c = f.handler.apply(this, arguments), a.type = b;
            return c
          }
        }
      }), p.support.submitBubbles || (p.event.special.submit = {
        setup: function() {
          if (p.nodeName(this, "form")) return !1;
          p.event.add(this, "click._submit keypress._submit", function(a) {
            var c = a.target,
              d = p.nodeName(c, "input") || p.nodeName(c, "button") ? c.form : b;
            d && !p._data(d, "_submit_attached") && (p.event.add(d, "submit._submit", function(a) {
              a._submit_bubble = !0
            }), p._data(d, "_submit_attached", !0))
          })
        },
        postDispatch: function(a) {
          a._submit_bubble && (delete a._submit_bubble, this.parentNode && !a.isTrigger && p.event.simulate("submit", this.parentNode, a, !0))
        },
        teardown: function() {
          if (p.nodeName(this, "form")) return !1;
          p.event.remove(this, "._submit")
        }
      }), p.support.changeBubbles || (p.event.special.change = {
        setup: function() {
          if (V.test(this.nodeName)) {
            if (this.type === "checkbox" || this.type === "radio") p.event.add(this, "propertychange._change", function(a) {
              a.originalEvent.propertyName === "checked" && (this._just_changed = !0)
            }), p.event.add(this, "click._change", function(a) {
              this._just_changed && !a.isTrigger && (this._just_changed = !1), p.event.simulate("change", this, a, !0)
            });
            return !1
          }
          p.event.add(this, "beforeactivate._change", function(a) {
            var b = a.target;
            V.test(b.nodeName) && !p._data(b, "_change_attached") && (p.event.add(b, "change._change", function(a) {
              this.parentNode && !a.isSimulated && !a.isTrigger && p.event.simulate("change", this.parentNode, a, !0)
            }), p._data(b, "_change_attached", !0))
          })
        },
        handle: function(a) {
          var b = a.target;
          if (this !== b || a.isSimulated || a.isTrigger || b.type !== "radio" && b.type !== "checkbox") return a.handleObj.handler.apply(this, arguments)
        },
        teardown: function() {
          return p.event.remove(this, "._change"), !V.test(this.nodeName)
        }
      }), p.support.focusinBubbles || p.each({
        focus: "focusin",
        blur: "focusout"
      }, function(a, b) {
        var c = 0,
          d = function(a) {
            p.event.simulate(b, a.target, p.event.fix(a), !0)
          };
        p.event.special[b] = {
          setup: function() {
            c++ === 0 && e.addEventListener(a, d, !0)
          },
          teardown: function() {
            --c === 0 && e.removeEventListener(a, d, !0)
          }
        }
      }), p.fn.extend({
        on: function(a, c, d, e, f) {
          var g, h;
          if (typeof a == "object") {
            typeof c != "string" && (d = d || c, c = b);
            for (h in a) this.on(h, c, d, a[h], f);
            return this
          }
          d == null && e == null ? (e = c, d = c = b) : e == null && (typeof c == "string" ? (e = d, d = b) : (e = d, d = c, c = b));
          if (e === !1) e = ba;
          else if (!e) return this;
          return f === 1 && (g = e, e = function(a) {
            return p().off(a), g.apply(this, arguments)
          }, e.guid = g.guid || (g.guid = p.guid++)), this.each(function() {
            p.event.add(this, a, e, d, c)
          })
        },
        one: function(a, b, c, d) {
          return this.on(a, b, c, d, 1)
        },
        off: function(a, c, d) {
          var e, f;
          if (a && a.preventDefault && a.handleObj) return e = a.handleObj, p(a.delegateTarget).off(e.namespace ? e.origType + "." + e.namespace : e.origType, e.selector, e.handler), this;
          if (typeof a == "object") {
            for (f in a) this.off(f, c, a[f]);
            return this
          }
          if (c === !1 || typeof c == "function") d = c, c = b;
          return d === !1 && (d = ba), this.each(function() {
            p.event.remove(this, a, d, c)
          })
        },
        bind: function(a, b, c) {
          return this.on(a, null, b, c)
        },
        unbind: function(a, b) {
          return this.off(a, null, b)
        },
        live: function(a, b, c) {
          return p(this.context).on(a, this.selector, b, c), this
        },
        die: function(a, b) {
          return p(this.context).off(a, this.selector || "**", b), this
        },
        delegate: function(a, b, c, d) {
          return this.on(b, a, c, d)
        },
        undelegate: function(a, b, c) {
          return arguments.length === 1 ? this.off(a, "**") : this.off(b, a || "**", c)
        },
        trigger: function(a, b) {
          return this.each(function() {
            p.event.trigger(a, b, this)
          })
        },
        triggerHandler: function(a, b) {
          if (this[0]) return p.event.trigger(a, b, this[0], !0)
        },
        toggle: function(a) {
          var b = arguments,
            c = a.guid || p.guid++,
            d = 0,
            e = function(c) {
              var e = (p._data(this, "lastToggle" + a.guid) || 0) % d;
              return p._data(this, "lastToggle" + a.guid, e + 1), c.preventDefault(), b[e].apply(this, arguments) || !1
            };
          e.guid = c;
          while (d < b.length) b[d++].guid = c;
          return this.click(e)
        },
        hover: function(a, b) {
          return this.mouseenter(a).mouseleave(b || a)
        }
      }), p.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function(a, b) {
        p.fn[b] = function(a, c) {
          return c == null && (c = a, a = null), arguments.length > 0 ? this.on(b, null, a, c) : this.trigger(b)
        }, Y.test(b) && (p.event.fixHooks[b] = p.event.keyHooks), Z.test(b) && (p.event.fixHooks[b] = p.event.mouseHooks)
      }),
      function(a, b) {
        function bc(a, b, c, d) {
          c = c || [], b = b || r;
          var e, f, i, j, k = b.nodeType;
          if (!a || typeof a != "string") return c;
          if (k !== 1 && k !== 9) return [];
          i = g(b);
          if (!i && !d)
            if (e = P.exec(a))
              if (j = e[1]) {
                if (k === 9) {
                  f = b.getElementById(j);
                  if (!f || !f.parentNode) return c;
                  if (f.id === j) return c.push(f), c
                } else if (b.ownerDocument && (f = b.ownerDocument.getElementById(j)) && h(b, f) && f.id === j) return c.push(f), c
              } else {
                if (e[2]) return w.apply(c, x.call(b.getElementsByTagName(a), 0)), c;
                if ((j = e[3]) && _ && b.getElementsByClassName) return w.apply(c, x.call(b.getElementsByClassName(j), 0)), c
              }
          return bp(a.replace(L, "$1"), b, c, d, i)
        }

        function bd(a) {
          return function(b) {
            var c = b.nodeName.toLowerCase();
            return c === "input" && b.type === a
          }
        }

        function be(a) {
          return function(b) {
            var c = b.nodeName.toLowerCase();
            return (c === "input" || c === "button") && b.type === a
          }
        }

        function bf(a) {
          return z(function(b) {
            return b = +b, z(function(c, d) {
              var e, f = a([], c.length, b),
                g = f.length;
              while (g--) c[e = f[g]] && (c[e] = !(d[e] = c[e]))
            })
          })
        }

        function bg(a, b, c) {
          if (a === b) return c;
          var d = a.nextSibling;
          while (d) {
            if (d === b) return -1;
            d = d.nextSibling
          }
          return 1
        }

        function bh(a, b) {
          var c, d, f, g, h, i, j, k = C[o][a];
          if (k) return b ? 0 : k.slice(0);
          h = a, i = [], j = e.preFilter;
          while (h) {
            if (!c || (d = M.exec(h))) d && (h = h.slice(d[0].length)), i.push(f = []);
            c = !1;
            if (d = N.exec(h)) f.push(c = new q(d.shift())), h = h.slice(c.length), c.type = d[0].replace(L, " ");
            for (g in e.filter)(d = W[g].exec(h)) && (!j[g] || (d = j[g](d, r, !0))) && (f.push(c = new q(d.shift())), h = h.slice(c.length), c.type = g, c.matches = d);
            if (!c) break
          }
          return b ? h.length : h ? bc.error(a) : C(a, i).slice(0)
        }

        function bi(a, b, d) {
          var e = b.dir,
            f = d && b.dir === "parentNode",
            g = u++;
          return b.first ? function(b, c, d) {
            while (b = b[e])
              if (f || b.nodeType === 1) return a(b, c, d)
          } : function(b, d, h) {
            if (!h) {
              var i, j = t + " " + g + " ",
                k = j + c;
              while (b = b[e])
                if (f || b.nodeType === 1) {
                  if ((i = b[o]) === k) return b.sizset;
                  if (typeof i == "string" && i.indexOf(j) === 0) {
                    if (b.sizset) return b
                  } else {
                    b[o] = k;
                    if (a(b, d, h)) return b.sizset = !0, b;
                    b.sizset = !1
                  }
                }
            } else
              while (b = b[e])
                if (f || b.nodeType === 1)
                  if (a(b, d, h)) return b
          }
        }

        function bj(a) {
          return a.length > 1 ? function(b, c, d) {
            var e = a.length;
            while (e--)
              if (!a[e](b, c, d)) return !1;
            return !0
          } : a[0]
        }

        function bk(a, b, c, d, e) {
          var f, g = [],
            h = 0,
            i = a.length,
            j = b != null;
          for (; h < i; h++)
            if (f = a[h])
              if (!c || c(f, d, e)) g.push(f), j && b.push(h);
          return g
        }

        function bl(a, b, c, d, e, f) {
          return d && !d[o] && (d = bl(d)), e && !e[o] && (e = bl(e, f)), z(function(f, g, h, i) {
            if (f && e) return;
            var j, k, l, m = [],
              n = [],
              o = g.length,
              p = f || bo(b || "*", h.nodeType ? [h] : h, [], f),
              q = a && (f || !b) ? bk(p, m, a, h, i) : p,
              r = c ? e || (f ? a : o || d) ? [] : g : q;
            c && c(q, r, h, i);
            if (d) {
              l = bk(r, n), d(l, [], h, i), j = l.length;
              while (j--)
                if (k = l[j]) r[n[j]] = !(q[n[j]] = k)
            }
            if (f) {
              j = a && r.length;
              while (j--)
                if (k = r[j]) f[m[j]] = !(g[m[j]] = k)
            } else r = bk(r === g ? r.splice(o, r.length) : r), e ? e(null, g, r, i) : w.apply(g, r)
          })
        }

        function bm(a) {
          var b, c, d, f = a.length,
            g = e.relative[a[0].type],
            h = g || e.relative[" "],
            i = g ? 1 : 0,
            j = bi(function(a) {
              return a === b
            }, h, !0),
            k = bi(function(a) {
              return y.call(b, a) > -1
            }, h, !0),
            m = [function(a, c, d) {
              return !g && (d || c !== l) || ((b = c).nodeType ? j(a, c, d) : k(a, c, d))
            }];
          for (; i < f; i++)
            if (c = e.relative[a[i].type]) m = [bi(bj(m), c)];
            else {
              c = e.filter[a[i].type].apply(null, a[i].matches);
              if (c[o]) {
                d = ++i;
                for (; d < f; d++)
                  if (e.relative[a[d].type]) break;
                return bl(i > 1 && bj(m), i > 1 && a.slice(0, i - 1).join("").replace(L, "$1"), c, i < d && bm(a.slice(i, d)), d < f && bm(a = a.slice(d)), d < f && a.join(""))
              }
              m.push(c)
            }
          return bj(m)
        }

        function bn(a, b) {
          var d = b.length > 0,
            f = a.length > 0,
            g = function(h, i, j, k, m) {
              var n, o, p, q = [],
                s = 0,
                u = "0",
                x = h && [],
                y = m != null,
                z = l,
                A = h || f && e.find.TAG("*", m && i.parentNode || i),
                B = t += z == null ? 1 : Math.E;
              y && (l = i !== r && i, c = g.el);
              for (;
                (n = A[u]) != null; u++) {
                if (f && n) {
                  for (o = 0; p = a[o]; o++)
                    if (p(n, i, j)) {
                      k.push(n);
                      break
                    }
                  y && (t = B, c = ++g.el)
                }
                d && ((n = !p && n) && s--, h && x.push(n))
              }
              s += u;
              if (d && u !== s) {
                for (o = 0; p = b[o]; o++) p(x, q, i, j);
                if (h) {
                  if (s > 0)
                    while (u--) !x[u] && !q[u] && (q[u] = v.call(k));
                  q = bk(q)
                }
                w.apply(k, q), y && !h && q.length > 0 && s + b.length > 1 && bc.uniqueSort(k)
              }
              return y && (t = B, l = z), x
            };
          return g.el = 0, d ? z(g) : g
        }

        function bo(a, b, c, d) {
          var e = 0,
            f = b.length;
          for (; e < f; e++) bc(a, b[e], c, d);
          return c
        }

        function bp(a, b, c, d, f) {
          var g, h, j, k, l, m = bh(a),
            n = m.length;
          if (!d && m.length === 1) {
            h = m[0] = m[0].slice(0);
            if (h.length > 2 && (j = h[0]).type === "ID" && b.nodeType === 9 && !f && e.relative[h[1].type]) {
              b = e.find.ID(j.matches[0].replace(V, ""), b, f)[0];
              if (!b) return c;
              a = a.slice(h.shift().length)
            }
            for (g = W.POS.test(a) ? -1 : h.length - 1; g >= 0; g--) {
              j = h[g];
              if (e.relative[k = j.type]) break;
              if (l = e.find[k])
                if (d = l(j.matches[0].replace(V, ""), R.test(h[0].type) && b.parentNode || b, f)) {
                  h.splice(g, 1), a = d.length && h.join("");
                  if (!a) return w.apply(c, x.call(d, 0)), c;
                  break
                }
            }
          }
          return i(a, m)(d, b, f, c, R.test(a)), c
        }

        function bq() {}
        var c, d, e, f, g, h, i, j, k, l, m = !0,
          n = "undefined",
          o = ("sizcache" + Math.random()).replace(".", ""),
          q = String,
          r = a.document,
          s = r.documentElement,
          t = 0,
          u = 0,
          v = [].pop,
          w = [].push,
          x = [].slice,
          y = [].indexOf || function(a) {
            var b = 0,
              c = this.length;
            for (; b < c; b++)
              if (this[b] === a) return b;
            return -1
          },
          z = function(a, b) {
            return a[o] = b == null || b, a
          },
          A = function() {
            var a = {},
              b = [];
            return z(function(c, d) {
              return b.push(c) > e.cacheLength && delete a[b.shift()], a[c] = d
            }, a)
          },
          B = A(),
          C = A(),
          D = A(),
          E = "[\\x20\\t\\r\\n\\f]",
          F = "(?:\\\\.|[-\\w]|[^\\x00-\\xa0])+",
          G = F.replace("w", "w#"),
          H = "([*^$|!~]?=)",
          I = "\\[" + E + "*(" + F + ")" + E + "*(?:" + H + E + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + G + ")|)|)" + E + "*\\]",
          J = ":(" + F + ")(?:\\((?:(['\"])((?:\\\\.|[^\\\\])*?)\\2|([^()[\\]]*|(?:(?:" + I + ")|[^:]|\\\\.)*|.*))\\)|)",
          K = ":(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + E + "*((?:-\\d)?\\d*)" +