import { fromJS } from 'immutable';
import { storeGenerator } from '../utils/Generator';

export default storeGenerator('StateStore', {
  handlers: {
    SET_STATE: 'setState',
  },

  defaults: {
    immutableState: fromJS({}),
  },

  initialize() {
    this.immutableState = this.defaults.immutableState;
  },

  setState({ state }) {
    const immutableState = this.immutableState.merge(fromJS(state));
    if (!this.immutableState.equals(immutableState)) {
      this.immutableState = immutableState;
      this.emitChange();
    }
  },

  getState() {
    return this.immutableState.toJS();
  },

  dehydrate() {
    return {
      state: this.immutableState.toJS(),
    };
  },

  rehydrate({ state }) {
    this.setState({ state });
  },
});
