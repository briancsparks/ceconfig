
module.exports.isnt               = isnt;
module.exports.is                 = is;
module.exports._isNaN             = _isNaN;

//-----------------------------------------------------------------------------------------------------------------------------
function _isNaN(value) {
  // NaNs are never equal to themselves, and are the only values that have this weird property
  // See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/isNaN

  if (typeof value !== 'number') {
    // This test does not apply
    return false;
  }

  var n = Number(value);
  return n !== n;
};

//-----------------------------------------------------------------------------------------------------------------------------
function isnt(value) {
  if (value === null)                       { return true; }
  if (value === void 0)                     { return true; }
  if (_isNaN(value))                        { return true; }

  return false;
}

//-----------------------------------------------------------------------------------------------------------------------------
function is(value) {
  return !isnt(value);
}

