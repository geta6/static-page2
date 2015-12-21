import get from 'lodash/object/get';
import StateStore from '../stores/StateStore';
import { actionGenerator } from '../utils/Generator';

export default actionGenerator('StateStore', {
  async setState({ context, payload }) {
    const state = get(payload, ['entity', 'state']);
    context.dispatch(StateStore.dispatchTypes.SET_STATE, { state });
  },
});
