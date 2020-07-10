
const util                                  = require('util');
const smart                                 = require('./smart');
const safe                                  = require('./safe');
const { smartKey, smartValue }              = smart;
const { to_snake_case, toCamelCase }        = smart;
const { extract, extracts }                 = smart;
const { safeJSONParse, safeJSONStringify }  = safe;

var log = function(){};

log = function(...args_) {
  const args = args_.map(function(arg) {
    return util.inspect(arg, {depth:null, colors:true});
  });
  console.log(...args);
};


// the mkARGV() function
module.exports = function(the_args_, options ={}) {
  const the_args      = the_args_  || process.argv.slice(2);
  const arrayNames    = options.arrayNames || {};

  var argv = {_:[]};

  var m;
  var i = 0, k;
  var old;
  var arg, values, arg2, arg3;

  var count = 0;
  for (i = 0; i < the_args.length && count < 20; count += 1) {
    old = i;                // Remember the index we are using (i changes below)
    arg = the_args[i];

    //log('arg', arg);

    if (false) {
    }

    // handle -- (end of params)
    else if (arg === '---') {
      argv.___ = [];
      i += 1;
      for(; i < the_args.length && the_args[i] !== '--'; i += 1) {
        arg3 = the_args[i];
        argv.___.push(arg3);
      }
    }

    // handle -- (end of params)
    else if (arg === '--') {
      argv.__ = [];
      i += 1;
      for(; i < the_args.length && the_args[i] !== '---'; i += 1) {
        arg2 = the_args[i];
        argv.__.push(arg2);
      }
    }

    // handle '-' (commonly used to mean to read from stdin)
    else if (arg === '-') {
      argv['-']     = true;
      argv.stdin    = true;
      i += 1;
    }

    // handle --foo=bar
    else if ((m = /^--([^=]+)=(.+)$/.exec(arg))) {
      argv = kv(argv, smartKey(m[1]), m[2]);
      i += 1;
    }

    // handle --no-foo as argv.foo = false
    else if ((m = /^--no-([^=]+)$/.exec(arg))) {
      argv = kv(argv, smartKey(m[1]), false);
      i += 1;
    }

    // handle --foo- as argv.foo = false
    else if ((m = /^--([^=]+)-$/.exec(arg))) {
      argv = kv(argv, smartKey(m[1]), false);
      i += 1;
    }

    // handle --foo= a b c as [a,b,c]
    else if ((m = /^--([^=]+)=$/.exec(arg))) {

      ([k, values] = processArrayItems(i));

      // Did we find any array params?
      if (values.length > 0) {
        argv = kv(argv, smartKey(m[1]), values);
        i += values.length;
      }

      // did not find array params
      else {
        argv = kv(argv, smartKey(m[1]), options.defEmptyArray || []);
      }
      i += 1;
    }

    // handle --foo a b c as [a,b,c]      (same as prev, but for --foo not --foo=)
    else if ((m = /^--([^=]+)$/.exec(arg))) {
      const key = smartKey(m[1]);

      if (key in arrayNames) {
        ([k, values] = processArrayItems(i));

        // Did we find any array params?
        if (values.length > 0) {
          argv = kv(argv, smartKey(m[1]), values);
          i += values.length;
        }

        // did not find array params
        else {
          argv = kv(argv, smartKey(m[1]), []);
        }
      } else {
        argv = kv(argv, smartKey(m[1]), true);
      }

      i += 1;
    }

    // handle -sSL- (single-char flags (false))
    else if ((m = /^-([^-]*)-$/.exec(arg))) {
      const flags = m[1];
      for (k = 0; k < flags.length; k += 1) {
        argv = kv(argv, flags[k], false);
      }
      i += 1;
    }

    // handle -sSL (single-char flags (true))
    else if ((m = /^-([^-]*)$/.exec(arg))) {
      const flags = m[1];
      for (k = 0; k < flags.length; k += 1) {
        argv = kv(argv, flags[k], true);
      }
      i += 1;
    }

    // Was it handled?
    if (i === old) {
      argv._.push(smartValue(arg));
      i += 1;
    }
    //log(count, argv, i, the_args.length);
  }
  //log('done', argv);

  // Add functions
  argv.extract = function(...keys) {
    return extract(argv, ...keys);
  };

  argv.extracts = function(...keys) {
    return extracts(argv, ...keys);
  };

  argv.shift = function() {
    return argv._.shift();
  };

  argv.pod = function() {
    let   result = safeJSONParse(safeJSONStringify(argv));
    delete result._;
    delete result.__;
    delete result.___;
    return result;
  };

  return argv;

  // ---------------------------------------------------------------------------------------------------------------------------
  function processArrayItems(i) {
    var j;

    values = [];
    for (j = i+1; j < the_args.length; j += 1) {

      // Stop looking when we see the next --bar param
      if (/^-/.exec(the_args[j]))  {
        break;
      }

      values = [...values, smartValue(the_args[j])];
    }

    return [j, values];
  }
};

// -------------------------------------------------------------------------------------------------------------------------
function kv(argv, k, v) {
  var   value       = v;
  const origKey     = k;
  const snakeKey    = smartKey(origKey);
  const camelKey    = toCamelCase(snakeKey);

  if (!Array.isArray(value)) {
    value = smartValue(v);
  }

  argv[snakeKey] = value;

  if (camelKey !== snakeKey) {
    argv[camelKey] = value;
  }

  return argv;
}

