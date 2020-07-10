
/**
 *  @file
 *
 *  Underscore.js like functions.
 */

module.exports.compact        = compact;


function compact(arr) {
  return arr.filter(Boolean);
}


