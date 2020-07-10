
const libIsnt                 = require('./isnt');
const { isnt }                = libIsnt;
//let   lib                     = extend(libIsnt);
let   lib = {};

lib.isnt      = libIsnt.isnt;
lib.extend    = extend;
lib._extend   = extend;

module.exports = lib;

/**
 *  Merges all the objs together (one-level deep), just like underscore.js/lodash,
 *
 *  * Does not mutate the first param
 *  * Filters out isnt-ish top-level attributes
 */
function extend(...objs) {
  let result = {};
  let i,j,objlen = objs.length;

  for (i=0; i<objlen; i++) {
    const obj     = objs[i];
    const keys    = Object.keys(obj);
    const keylen  = keys.length;

    for (j=0; j<keylen; j++) {
      const key   = keys[j];
      const value = obj[key];

      if (!isnt(value)) {
        result = {...result, [key]:value};
      }
    }
  }

  return result;
}

