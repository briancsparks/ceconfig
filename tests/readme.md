
# AVA

## Assertions


## Built-in assertions

### `.pass(message?)`

Passing assertion.

### `.fail(message?)`

Failing assertion.

### `.assert(value, message?)`

Asserts that `value` is truthy. This is [`power-assert`](#enhanced-assertion-messages) enabled.

### `.truthy(value, message?)`

Assert that `value` is truthy.

### `.falsy(value, message?)`

Assert that `value` is falsy.

### `.true(value, message?)`

Assert that `value` is `true`.

### `.false(value, message?)`

Assert that `value` is `false`.

### `.is(value, expected, message?)`

Assert that `value` is the same as `expected`. This is based on [`Object.is()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is).

### `.not(value, expected, message?)`

Assert that `value` is not the same as `expected`. This is based on [`Object.is()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is).

### `.deepEqual(value, expected, message?)`

Assert that `value` is deeply equal to `expected`. See [Concordance](https://github.com/concordancejs/concordance) for details. Works with [React elements and `react-test-renderer`](https://github.com/concordancejs/react).

### `.notDeepEqual(value, expected, message?)`

Assert that `value` is not deeply equal to `expected`. The inverse of `.deepEqual()`.

### `.like(value, selector, message?)`

Assert that `value` is like `selector`. This is a variant of `.deepEqual()`, however `selector` does not need to have the same enumerable properties as `value` does.

Instead AVA derives a *comparable* object from `value`, based on the deeply-nested properties of `selector`. This object is then compared to `selector` using `.deepEqual()`.

Any values in `selector` that are not regular objects should be deeply equal to the corresponding values in `value`.

This is an experimental assertion for the time being. You need to enable it:

**`package.json`**:

```json
{
	"ava": {
		"nonSemVerExperiments": {
			"likeAssertion": true
		}
	}
}
```

**`ava.config.js`**:

```js
export default {
	nonSemVerExperiments: {
		likeAssertion: true
	}
}
```

In the following example, the `map` property of `value` must be deeply equal to that of `selector`. However `nested.qux` is ignored, because it's not in `selector`.

```js
t.like({
	map: new Map([['foo', 'bar']]),
	nested: {
		baz: 'thud',
		qux: 'quux'
	}
}, {
	map: new Map([['foo', 'bar']]),
	nested: {
		baz: 'thud',
	}
})
```

### `.throws(fn, expectation?, message?)`

Assert that an error is thrown. `fn` must be a function which should throw. The thrown value *must* be an error. It is returned so you can run more assertions against it.

`expectation` can be an object with one or more of the following properties:

* `instanceOf`: a constructor, the thrown error must be an instance of
* `is`: the thrown error must be strictly equal to `expectation.is`
* `message`: either a string, which is compared against the thrown error's message, or a regular expression, which is matched against this message
* `name`: the expected `.name` value of the thrown error
* `code`: the expected `.code` value of the thrown error

`expectation` does not need to be specified. If you don't need it but do want to set an assertion message you have to specify `null`.

Example:

```js
const fn = () => {
	throw new TypeError('�');
};

test('throws', t => {
	const error = t.throws(() => {
		fn();
	}, {instanceOf: TypeError});

	t.is(error.message, '�');
});
```

### `.throwsAsync(thrower, expectation?, message?)`

Assert that an error is thrown. `thrower` can be an async function which should throw, or a promise that should reject. This assertion must be awaited.

The thrown value *must* be an error. It is returned so you can run more assertions against it.

`expectation` can be an object with one or more of the following properties:

* `instanceOf`: a constructor, the thrown error must be an instance of
* `is`: the thrown error must be strictly equal to `expectation.is`
* `message`: either a string, which is compared against the thrown error's message, or a regular expression, which is matched against this message
* `name`: the expected `.name` value of the thrown error
* `code`: the expected `.code` value of the thrown error

`expectation` does not need to be specified. If you don't need it but do want to set an assertion message you have to specify `null`.

Example:

```js
test('throws', async t => {
	await t.throwsAsync(async () => {
		throw new TypeError('�');
	}, {instanceOf: TypeError, message: '�'});
});
```

```js
const promise = Promise.reject(new TypeError('�'));

test('rejects', async t => {
	const error = await t.throwsAsync(promise);
	t.is(error.message, '�');
});
```

### `.notThrows(fn, message?)`

Assert that no error is thrown. `fn` must be a function which shouldn't throw.

### `.notThrowsAsync(nonThrower, message?)`

Assert that no error is thrown. `nonThrower` can be an async function which shouldn't throw, or a promise that should resolve.

Like the `.throwsAsync()` assertion, you must wait for the assertion to complete:

```js
test('resolves', async t => {
	await t.notThrowsAsync(promise);
});
```

### `.regex(contents, regex, message?)`

Assert that `contents` matches `regex`.

### `.notRegex(contents, regex, message?)`

Assert that `contents` does not match `regex`.

### `.snapshot(expected, message?)`
### `.snapshot(expected, options?, message?)`

Compares the `expected` value with a previously recorded snapshot. Snapshots are stored for each test, so ensure you give your tests unique titles. Alternatively pass an `options` object to select a specific snapshot, for instance `{id: 'my snapshot'}`.

Snapshot assertions cannot be skipped when snapshots are being updated.

### `.try(title?, implementation | macro | macro[], ...args?)`

`.try()` allows you to *try* assertions without causing the test to fail.

The implementation function behaves the same as any other test function. You can even use macros. The first title argument is always optional. Additional arguments are passed to the implemetation or macro function.

`.try()` is an asynchronous function. You must `await` it. The result object has `commit()` and `discard()` methods. You must decide whether to commit or discard the result. If you commit a failed result, your test will fail.

You can check whether the attempt passed using the `passed` property. Any assertion errors are available through the `errors` property. The attempt title is available through the `title` property.

Logs from `t.log()` are available through the `logs` property. You can choose to retain these logs as part of your test by passing `{retainLogs: true}` to the `commit()` and `discard()` methods.

The implementation function receives its own [execution context](./02-execution-context.md), just like a test function. You must be careful to only perform assertions using the attempt's execution context. At least one assertion must pass for your attempt to pass.

You may run multiple attempts concurrently, within a single test. However you can't use snapshots when you do so.

Example:

```js
const twoRandomIntegers = () => {
	const rnd = Math.round(Math.random() * 100);
	const x = rnd % 10;
	const y = Math.floor(rnd / 10);
	return [x, y];
};

test('flaky macro', async t => {
	const firstTry = await t.try((tt, a, b) => {
		tt.is(a, b);
	}, ...randomIntegers());

	if (firstTry.passed) {
		firstTry.commit();
		return;
	}

	firstTry.discard();
	t.log(firstTry.errors);

	const secondTry = await t.try((tt, a, b) => {
		tt.is(a, b);
	}, ...randomIntegers());
	secondTry.commit();
});
```
