
const path                                  = require('path');
const os                                    = require('os');
const util                                  = require('util');
const mkARGV                                = require('./argv');
const smart                                 = require('./smart');
const { smartKey, smartValue }              = smart;
const { resolveIt, resolveItWithDeref }     = smart;

var log = function(){};

if (mkARGV().debug) {
  log = function(...args_) {
    const args = args_.map(function(arg) {
      return util.inspect(arg, {depth:null, colors:true});
    });
    console.log(...args);
  }
}

// ------------------------------------------------------------------------------------------------------------------------
// The CONFIG function
module.exports = function(optionsA ={}) {

  const ARGV        = mkARGV(null, optionsA);
  const startCwd    = resolveIt(optionsA.cwd) || process.cwd();
  const project     = optionsA.project;
  const custFnA     = optionsA.fn || function(){};

  return CONFIG;

  function CONFIG(name, optionsB ={}) {
    const custFnB     = optionsB.fn || function(){};
    //log({query:name, optionsB});

    var result;
    var filename;
    var name2;

    // command-line args have highest priority
    if (name in ARGV) {
      return ARGV[name];
    }

    // Maybe in the ENV
    if (name in process.env) {
      return smartValue(process.env[name]);
    }

    name2 = name.toUpperCase();
    if (name2 in process.env) {
      return smartValue(process.env[name2]);
    }

    name2 = `${project}_${name}`.toUpperCase();
    if (name2 in process.env) {
      return smartValue(process.env[name2]);
    }

    const cwd       = process.cwd();
    var   configs   = null;

    configs = configs ||  custFnA(name, project);
    configs = configs ||  custFnB(name, project);

    configs = configs ||  bringIn(filename = path.join(cwd, '.ceconfig.json'));
    configs = configs ||  bringIn(filename = path.join(cwd, '.ceconfig', 'index.json'));
    configs = configs ||  bringIn(filename = path.join(cwd, '.ceconfig.json.js'));
    configs = configs ||  bringIn(filename = path.join(cwd, '.ceconfig', 'index.json.js'));

    if (startCwd !== cwd) {
      configs = configs ||  bringIn(filename = path.join(startCwd, '.ceconfig.json'));
      configs = configs ||  bringIn(filename = path.join(startCwd, '.ceconfig', 'index.json'));
      configs = configs ||  bringIn(filename = path.join(startCwd, '.ceconfig.json.js'));
      configs = configs ||  bringIn(filename = path.join(startCwd, '.ceconfig', 'index.json.js'));
    }

    // TOODO: bring in projec-root/.ceconfig

    if (!configs) {
      const homeDir = os.homedir();
      if (homeDir !== cwd) {
        configs = configs ||  bringIn(filename = path.join(homeDir, '.ceconfig.json'));
        configs = configs ||  bringIn(filename = path.join(homeDir, '.ceconfig', 'index.json'));
        configs = configs ||  bringIn(filename = path.join(homeDir, '.ceconfig.json.js'));
        configs = configs ||  bringIn(filename = path.join(homeDir, '.ceconfig', 'index.json.js'));
      }
    }

    if (isScalar(configs)) {
      return doReturn(configs);
    }

    result = resolveItWithDeref(configs, [name, project]);

    if (isScalar(result)) {
      return doReturn(result);
    }

    return doReturn(result);

    function doReturn(result) {
      return result;
    }

    // ------------------------------------------------------------------------------------------------------------------------
    function bringIn(pathname) {
      var result;

      if (pathname.endsWith('.json')) {
        if ((result = include(pathname))) {
          return result;
        }
      }

      else if (pathname.endsWith('.json.js')) {
        result = include(pathname);
        if (result) {
          return result;
        }
      }

      return result;
    }

  }
};

// ------------------------------------------------------------------------------------------------------------------------
function include(pathname) {
  try {
    return require(pathname);
  }

  catch(err) {
    console.error(`error including ${pathname}`);
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


