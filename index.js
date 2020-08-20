
const { splitify }            = require('./lib/utils');

module.exports.mkCONFIG = require('./lib/config');

// TODO: add:
//
// run, runll, reduce,
// extend -- isnt-ish values not put in
//

if (require.main === module) {
  require('./lib/run-function').run();
}

// ------------------------------------------------------------------------------------------------------------------------
module.exports.all = function() {
  let   lib                     = require('./lib/extend');
  const { extend }              = lib;

  lib = extend(lib,
    require('./lib/argv'),
    require('./lib/isnt'),
    require('./lib/safe'),
    require('./lib/smart'),
    require('./lib/underscoreish'),
    require('./lib/utils')
  );

  return lib;
};


// ------------------------------------------------------------------------------------------------------------------------
module.exports.lib = function(names_) {
  const names = splitify(names_);
  let   i, len = names.length;

  let   result = {};

  for (i=0; i<len; i++) {
    let name = names[i];

    switch (name) {
      case 'to_snake_case':
      case 'toSnakeCase':
      case 'toCamelCase':
      case 'resolveIt':
      case 'resolveItWithDeref':
      case 'smartKey':
      case 'isnt':
      case 'extract':
      case 'extracts':
      case 'smartValue':
        result[name] = require('./lib/smart')[name];
        break;

      case 'mkARGV':
        result[name] = require('./lib/argv');
        break;

      case 'arrayify':
      case 'cleanKey':
      case 'keyMirror':
      case 'splitify':
      case 'isScalar':
      case 'include':
      case 'safeStatSync':
      case 'getProjectRoot':
      case 'pad':
        result[name] = require('./lib/utils')[name];
        break;

      case 'safeJSONParse':
      case 'safeJSONStringify':
        result[name] = require('./lib/safe')[name];
        break;

      case 'extend':
        result[name] = require('./lib/extend')[name];
        break;

    }
  }

  return result;
};

