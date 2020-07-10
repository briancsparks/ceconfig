
module.exports.safeJSONParse        = safeJSONParse;
module.exports.safeJSONStringify    = safeJSONStringify;
module.exports.include              = include;

function safeJSONParse(str) {
  try {
    return JSON.parse(str);
  } catch(err) {
    //console.error(err);
  }

  // return undefined
}

function safeJSONStringify(...args) {
  try {
    return JSON.stringify(...args);
  } catch(err) {
    //console.error(err);
  }

  // return undefined
}

function include(filename) {
  try {
    return require(filename);
  } catch(err) {
    //console.error(err);
  }

  // return undefined
}

