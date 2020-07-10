
const { isnt, _isNaN }            = require('./isnt');

module.exports.smartValue         = smartValue;
module.exports.smartKey           = smartKey;
module.exports.isnt               = isnt;
module.exports._isNaN             = _isNaN;
module.exports.extract            = extract;
module.exports.extracts           = extracts;
module.exports.to_snake_case      = to_snake_case;
module.exports.toSnakeCase        = to_snake_case;
module.exports.toCamelCase        = toCamelCase;
module.exports.resolveIt          = resolveIt;
module.exports.resolveItWithDeref = resolveItWithDeref;
module.exports.deref              = deref;

////-----------------------------------------------------------------------------------------------------------------------------
//const _isNaN = Number.isNaN || function(value) {
//  // NaNs are never equal to themselves, and are the only values that have this weird property
//  // See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/isNaN
//
//  var n = Number(value);
//  return n !== n;
//};



//-----------------------------------------------------------------------------------------------------------------------------
/**
 *  Makes x the right type.
 */
function smartValue(value) {
  if (typeof value === 'string') {

    // Native true, false, null
    if (value.toLowerCase() === 'true')       { return true; }
    if (value.toLowerCase() === 'false')      { return false; }
    if (value.toLowerCase() === 'null')       { return null; }

    // Numbers
    if (/^[0-9]+$/.exec(value))               { return parseInt(value, 10); }

    // Dates: 2018-12-31T10:08:56.016Z
    if (value.length >= 24 && value[10] === 'T') {
      if (value.match(/\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d.\d\d\d/)) {
        return new Date(value);
      }
    }

    // Numbers
    if (/^[0-9]+[.]([0-9]+)?$/.exec(value))   { return smartNumber(value); }
    if (/^[.][0-9]+$/.exec(value))            { return smartNumber(value); }

    // RegExps
    const m = value.match(/^[/](.+)[/]$/);
    if (m) {
      return new RegExp(m[1]);
    }

    // JSON?    (re: |startof string (^)|any whitespace ([\t\n\r ]*)|either '{' or '['|
    if (/^[\t\n\r ]*[{[]/.exec(value)) {
      try {
        return JSON.parse(value);
      } catch(e) {}

      try {
        return JSON.parse(value.replace(/'/g, '"'));
      } catch(e) {}

    }
  }

  return value;
};

//-----------------------------------------------------------------------------------------------------------------------------
function to_snake_case(key) {
  return key.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
}

//-----------------------------------------------------------------------------------------------------------------------------
function toCamelCase(key) {
  var parts = key.split(/[^a-zA-Z0-9]/);
  var first = parts.shift();
  return parts.reduce(function(s, part) {
    return s + toUpperWord(part);
  }, first);
}

//-----------------------------------------------------------------------------------------------------------------------------
function toUpperWord(s) {
  if (s.length === 0) { return s; }

  return s[0].toUpperCase() + s.substring(1);
}


//-----------------------------------------------------------------------------------------------------------------------------
function smartNumber(value, def =0) {
  var n = +smartValue(value);

  if (_isNaN(n)) {
    return def;
  }

  return n;
}

//-----------------------------------------------------------------------------------------------------------------------------
function smartKey(key_, preserveCase) {
  var key = key_;
  if (typeof key === 'number') {
    key = ''+key;
  }

  if (typeof key !== 'string')      { return; }   /* returns undefined */

  // Only alnum and underscore
  key = key.replace(/[^a-z0-9_]/ig, '_');

  if (!preserveCase) {
    key = key.toLowerCase();
  }

  // Cannot start with digit
  if (key.match(/^[0-9]/)) {
    key = '_'+key;
  }

  return key;
}

////-----------------------------------------------------------------------------------------------------------------------------
//function isnt(value) {
//  if (value === null)                       { return true; }
//  if (value === void 0)                     { return true; }
//  if (_isNaN(value))                        { return true; }
//
//  return false;
//}

//-----------------------------------------------------------------------------------------------------------------------------
function deref(x, keys_) {
  if (isnt(x))      { return; /* undefined */ }
  if (isnt(keys_))  { return; /* undefined */ }

  var keys    = Array.isArray(keys_) ? keys_.slice() : keys_.split('.'), key;
  var result  = x;

  while (keys.length > 0) {
    key = keys.shift();
    if (!(result = result[key])) {
      // We got a falsy result.  If this was the last item, return it (so, for example
      // we would return a 0 (zero) if looked up.
      if (keys.length === 0) { return result; }

      /* otherwise -- return undefined */
      return; /* undefined */
    }
  }

  return result;
}

//-----------------------------------------------------------------------------------------------------------------------------
function resolveIt(x, args) {
  if (typeof x === 'function') {
    return x(...argx);
  }

  return x;
}

//-----------------------------------------------------------------------------------------------------------------------------
function resolveItWithDeref(x, args) {
  const [ name, ...rest ] = (args || []);

  //var   result = x[name];
  var   result = deref(x, name);

  if (typeof result === 'function') {
    result = result(...args);
  }

  if (!isScalar(result) && (typeof name === 'string') && (name in result)) {
    return result[name];
  }

  return result;
}

// ------------------------------------------------------------------------------------------------------------------------
function isScalar(x) {
  if (Array.isArray(x)) { return false; }

  const type = typeof x;
  if (':undefined:string:number:boolean:bigint:symbol:'.indexOf(type) !== -1) {
    return true;
  }

  return typeof x !== 'object';
}

// ------------------------------------------------------------------------------------------------------------------------

/**
 * Extract a single value out of an object.
 *
 * Many keys can be passed in. All will be removed from the original object, and the result of this function will
 * be the first that is truthy.
 *
 */
function extract(o, ...keys) {
  var result;
  var i, key, value;

  for (i = 0; i < keys.length; i += 1) {
    key = keys[i];
    if (key in o) {
      value = o[key];
      result = result || value;
      delete o[key];
    }
  }

  return result;
}

// ------------------------------------------------------------------------------------------------------------------------

/**
 * Extract many values out of an object.
 *
 * Many keys can be passed in. All will be remoted from the original object, and the result of this function will
 * be an object containing all those key/values.
 *
 */
function extracts(o, ...keys) {
  var result = {};
  var i, key;

  for (i = 0; i < keys.length; i += 1) {
    key = keys[i];
    if (key in o) {
      result[key] = o[key];
      delete o[key];
    }
  }

  return result;
}

