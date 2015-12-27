import expect from 'expect';
import { createStore, applyMiddleware } from 'redux';
import { createAction } from 'redux-actions';
import R from 'ramda';
import { IO, Future } from 'ramda-fantasy';
import futureMiddleware from 'redux-future';

import ioMiddleware from '../src';


describe('redux-io', () => {
  let store, unsubscribe;

  before(() => {
    const initialState =
      { counter: 0
      , fsa: 'failed'
      };

    function counter(state = initialState, action) {
      switch (action.type) {
      case 'INCREMENT':
        return { ... state
               , counter: state.counter + 1
               };
      case 'FSA_ACTION':
        return { ... state
               , fsa: action.payload
               };
      default:
        return state
      }
    }

    const createStoreWithMiddleware = applyMiddleware(
      futureMiddleware
    , ioMiddleware('runIO')
    )(createStore)

    store = createStoreWithMiddleware(counter);
  });


  afterEach(() => {
    unsubscribe();
  });

  it('should work with an io', done => {
    const spy = expect.createSpy()

    unsubscribe = store.subscribe(() => {
      expect(store.getState().counter).toEqual(1);
      expect(spy).toHaveBeenCalled()
      done();
    });
    const io = IO(() => {
      spy();
      return { type: 'INCREMENT' };
    });
    store.dispatch(io);
  });

  it('should work with FSA', done => {
    const spy = expect.createSpy()

    unsubscribe = store.subscribe(() => {
      expect(store.getState().fsa).toEqual('TEST');
      expect(spy).toHaveBeenCalled()
      done();
    });
    const io = IO(() => {
      spy();
      return 'test';
    });


    const action = createAction('FSA_ACTION');
    store.dispatch(action(R.map(R.toUpper, io)));
  });

  it('should work together with futures', done => {
    const spy = expect.createSpy()

    unsubscribe = store.subscribe(() => {
      expect(store.getState().fsa).toEqual('back to the future');
      expect(spy).toHaveBeenCalled()
      done();
    });
    const future = new Future((rej, res) => {
      const io = IO(() => {
        spy();
        return 'back to the future';
      });

      setTimeout(() => res(io), 100);
    });


    const action = createAction('FSA_ACTION');
    store.dispatch(action(future));
  });
});
