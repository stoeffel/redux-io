import { isFSA } from 'flux-standard-action';


const typeOf = (type) => (val) => typeof val === type;
const isFunction = typeOf('function');

export default runIO => function ioMiddleware({ dispatch }) {
  const isIO = io => io && isFunction(io[runIO]);

  return next => action => {
    if (!isFSA(action)) {
      return isIO(action)
        ? dispatch(action[runIO]())
        : next(action);
    }

    return isIO(action.payload)
      ? dispatch({ ...action, payload: action.payload[runIO]() })
      : next(action);
  };
}
