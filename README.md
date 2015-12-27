redux-io
============

[![build status](https://img.shields.io/travis/stoeffel/redux-io/master.svg?style=flat-square)](https://travis-ci.org/stoeffel/redux-io)
[![npm version](https://img.shields.io/npm/v/redux-io.svg?style=flat-square)](https://www.npmjs.com/package/redux-io)

[FSA](https://github.com/acdlite/flux-standard-action)-compliant io monad [middleware](https://github.com/gaearon/redux/blob/master/docs/middleware.md) for Redux.

This is based on [redux-future](https://github.com/stoeffel/redux-future).


```js
npm install --save redux-io
```

## Usage

```js
import ioMiddleware from 'redux-io';
const createStoreWithMiddleware = applyMiddleware(
  ioMiddleware('runIO') // <- function name of the function to run the IO.
)(createStore)
```


### Example

```js
import { IO } from 'ramda-fantasy';

const io = IO(() => {
  document.title = "Goodbye World!";
  return { type: 'INCREMENT' };
});
store.dispatch(io);

```

## Using in combination with redux-actions

Because it supports FSA actions, you can use redux-io in combination with [redux-actions](https://github.com/acdlite/redux-actions).

### Example: Action creators

```js
const io = IO(() => location.href);

const action = createAction('FSA_ACTION');
store.dispatch(action(R.map(R.toUpper, io)));
```

### Example: Future(IO)

You can use `redux-io` together with [`redux-future`](https://github.com/stoeffel/redux-future).

```js
// futureIo :: Future(IO(String))
const futureIo = new Future((rej, res) => {
  const io = IO(() => location.href);

  setTimeout(() => res(io), 2000);
});

const action = createAction('FSA_ACTION');
store.dispatch(action(futureIo));
```


## Related

### What's an IO?
* [mostly-adequate-guide  Chapter 8.5 Old McDonald had Effects...](https://drboolean.gitbooks.io/mostly-adequate-guide/content/ch8.html)

### Libraries

* [ramda-fantasy](https://github.com/ramda/ramda-fantasy)
* [fantasy-io](https://github.com/fantasy-land/fantasy-io)
* [redux-future](https://github.com/stoeffel/redux-future)
