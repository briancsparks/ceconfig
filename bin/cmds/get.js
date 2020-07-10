
/**
 *  The CLI command for ceconfig `get` sub-command.
 *
 *  Get adj
 *  ceconfig get adj
 *
 *  Default to 'bar', if foo is not found:
 *  ceconfig get foo -- bar
 *
 *  Use a specific set of command-line parameters (ARGV)
 *  ceconfig get foo --- --my=favorite
 *
 *     Using a different ARGV is good when calling ceconfig from a script, for example.
 *     You usually want ceconfig to use the ARGV that was passed into the script, not
 *     the one you are calling ceconfig with:
 *
 *  ceconfig get foo --- $@
 *
 *  Consider:
 *
 *  ceconfig get editor -- emacs --- --editor=intellij
 *  ceconfig get editox -- emacs --- --editorx=intellij
 *  ceconfig get editor -- emacs
 *
 *  Assuming EDITOR=vim in your environment,
 *
 *     1. intellij
 *       * From the --editor=intellij input after ---
 *     2. emacs
 *       * editox is not in the environment, object after --- does not have editox, so default.
 *     3. vim
 *       * 'editor' found in environment
 *
 */

const safe            = require('../../lib/safe');
const { isnt }        = require('../../lib/smart');
const { mkCONFIG }    = require('../..');

const { safeJSONStringify }     = safe;

module.exports = function(ARGV) {

  // The caller can pass in a different argv array, after ---
  //    a lot like the example (1) above, which gives 'intellij'
  var   configOpts  = ARGV.extracts('___');
  const CONFIG      = mkCONFIG(configOpts);

  // Get the result
  var   result = CONFIG(ARGV._[0] || '');

  // Default is first item after '--';
  if (isnt(result)) {
    if (Array.isArray(ARGV.__)) {
      result = ARGV.__[0];
    }
  }

  // Exit and output
  var exitCode = 9;
  if (!isnt(result)) {
    exitCode = 0;
    outputResult(result);
  }

  process.exit(exitCode);
};

/**
 *  Our output is usually used by a script, so:
 *
 *  * Output Arrays normally
 *  * Output strings without quotes
 */
function outputResult(result) {
  if (Array.isArray(result)) {
    console.log(safeJSONStringify(result));
    return;
  }

  if (typeof result === 'string' || typeof result === 'number') {
    console.log(result);
    return;
  }

  console.log(safeJSONStringify(result));
}



