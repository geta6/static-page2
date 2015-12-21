import get from 'lodash/object/get';
import debounce from 'lodash/function/debounce';
import keyMirror from 'fbjs/lib/keyMirror';
import { createStore } from 'fluxible/addons';

export function actionGenerator(displayName, actions) {
  if (process.env.NODE_ENV === 'development') {
    Object.keys(actions).forEach(actionName => {
      if (actions[actionName]) {
        console.assert(/regeneratorRuntime\.async/.test(actions[actionName].toString()), `${displayName}.${actionName} should be async function`);
      }
    });
  }
  return Object.assign((context, payload) => {
    return new Promise(async (resolve, reject) => {
      const actionType = get(payload, ['type']);
      const action = actions[actionType];
      if (!action) {
        reject(new Error(`No action responded to ${displayName}.`));
      } else {
        console.info(`execute ${displayName}.${actionType}`);
        resolve(await action({ context, payload }));
      }
    });
  }, { displayName, actionTypes: keyMirror(actions) });
}

export function storeGenerator(storeName, properties) {
  if (process.env.NODE_ENV === 'development') {
    console.assert(properties.handlers, `${storeName}.handlers not found`);
    console.assert(properties.rehydrate, `${storeName}.rehydrate not found`);
    console.assert(properties.dehydrate, `${storeName}.dehydrate not found`);
  }
  const storeProperties = Object.assign({ storeName }, properties, {
    initialize() {
      const emitChange = this.emitChange.bind(this);
      this.emitChange = debounce(emitChange, 120, { leading: false });
      typeof properties.initialize === 'function' && properties.initialize.call(this);
    },
  });
  return Object.assign(createStore(storeProperties), { dispatchTypes: keyMirror(properties.handlers) });
}
