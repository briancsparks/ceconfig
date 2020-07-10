
const {include}      = require('./safe');

module.exports.echo = echo;
module.exports.run  = runFunction;

if (require.main === module) {
  return runFunction();
}

function runFunction() {
  const ARGV    = require('./argv')();
  //console.log({ARGV});

  let   filename = ARGV._.shift();
  if (!filename)                      { return die(`Need filename`); }
  filename = `${process.cwd()}/${filename}`;

  const fnname = ARGV._.shift();
  if (!fnname)                        { return die(`Need function name`); }

  const mod = include(filename);
  if (!mod)                           { return die(`${filename} not found`); }

  const fn = mod[fnname];
  if (!fn)                            { return die(`${fnname} not found`); }

  let   result = fn(ARGV.pod());
  if (Array.isArray(result)) {
    result = result[0];
  }

  console.log(result);

  return 0;

  function die(msg, code =99) {
    console.error(msg);
    process.exit(code);
    return code;
  }
}

function echo(...args) {
  return [...args];
}

