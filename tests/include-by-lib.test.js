
const test = require('ava');

test('foo', t => {
	t.pass();
});

test('bar', async t => {
	const bar = Promise.resolve('bar');
	t.is(await bar, 'bar');
});

test(`Can require single fn by lib()`, t => {
  const { smartValue }  = require('..').lib('smartValue');

  t.is(typeof smartValue, 'function');

  t.is(smartValue('true'), true);
});

test(`Can require another single fn by lib()`, t => {
  const { to_snake_case }  = require('..').lib('to_snake_case');

  t.is(typeof to_snake_case, 'function');

  t.is(to_snake_case('foo-bar'), 'foo_bar');
});

test(`Can require multiple single fn by lib()`, t => {
  const { mkARGV, arrayify, ...rest }  = require('..').lib('mkARGV,arrayify');

  t.is(typeof mkARGV, 'function');
  t.is(typeof arrayify, 'function');
});


