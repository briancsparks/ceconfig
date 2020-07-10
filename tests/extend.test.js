
const { extend }    = require('../lib/extend');
const test          = require('ava');

test(`simple extend() works`, t => {
  const result = extend({foo:'bar'});

  t.deepEqual(result, {foo:'bar'});
});

test(`extend() skips isnt-ish`, t => {
  const obj     = {};
  const undef   = obj.x;
  const y       = 42;

  const result  = extend({y}, {undef});

  t.deepEqual(result, {y:42});
});


