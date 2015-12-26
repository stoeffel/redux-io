import expect from 'expect';
import { createStore, applyMiddleware } from 'redux';
import { createAction } from 'redux-actions';
import R from 'ramda';
import { IO } from 'ramda-fantasy';

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
      ioMiddleware('runIO')
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
      expect(store.getState().fsa).toEqual('test');
      expect(spy).toHaveBeenCalled()
      done();
    });
    const io = IO(() => {
      spy();
      return 'test';
    });

    const action = createAction('FSA_ACTION');
    store.dispatch(action(io));
  });
});
