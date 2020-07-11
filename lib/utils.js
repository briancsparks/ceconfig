
const path                    = require('path');
let   lib                     = require('./extend');
const fs                      = require('fs');
const {extend}                = lib;

lib                           = extend(lib, require('./underscoreish'));

lib = extend(lib, {
  splitify,
  arrayify,
  cleanKey,
  keyMirror,
  isScalar,
  include,
  safeStatSync,
  getProjectRoot,
  pad
});

module.exports = lib;

const { compact } = lib;


// ------------------------------------------------------------------------------------------------------------------------
function splitify(x, sep) {
  if (Array.isArray(x)) { return x; }

  if (sep) {
    return x.split(sep);
  }

  let result = compact(x.split('\n'));
  if (result.length > 1) {
    return result;
  }

  return compact(x.split(/,\s*/g));
}

// ------------------------------------------------------------------------------------------------------------------------
function arrayify(x, sep) {
  if (Array.isArray(x)) { return x; }

  if (typeof x === 'string') {
    return splitify(x, sep);
  }

  return compact([x]);
}

// ------------------------------------------------------------------------------------------------------------------------
function cleanKey(key) {
  return key.replace(/[^0-9a-z_]/ig, '_');
}

// ------------------------------------------------------------------------------------------------------------------------
function keyMirror(str) {
  let result = {};
  let keys   = splitify(str, ',');
  let length = keys.length;

  let i;
  for (i=0; i<length; i++) {
    let key = keys[i];
    result[key] = key;
  }

  return result;
}

// ------------------------------------------------------------------------------------------------------------------------
function pad(len, x_, ch_) {
  let x     = ''+x_;
  let ch    = ch_ || (typeof x_ === 'number') ? '0' : ' ';

  while (x.length < len) {
    x = ch + x;
  }

  return x;
}

// ------------------------------------------------------------------------------------------------------------------------
function getProjectRoot(dir) {

  const stats = safeStatSync(path.join(dir, '.git'));
  if (stats && stats.isDirectory()) {
    return dir;
  }

  const parent  = path.dirname(dir);

  // Do not go above /home/user
  if (parent.split(path.sep).length <= 3) {
    return;
  }

  return getProjectRoot(parent);
}

// ------------------------------------------------------------------------------------------------------------------------
function safeStatSync(x) {
  try {
    return fs.statSync(x);
  } catch(err) {
    //console.error(`stat error: `, err);
  }
}

// ------------------------------------------------------------------------------------------------------------------------
function include(pathname) {
  try {
    return require(pathname);
  }

  catch(err) {
    //console.error(`error including ${pathname}`);
  }
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


