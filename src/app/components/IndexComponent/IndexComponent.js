import React, { PropTypes } from 'react';
import { connectToStores } from 'fluxible-addons-react';
import StateAction from '../../actions/StateAction';
import style from './IndexComponent.styl';

let IndexComponent = React.createClass({
  displayName: 'IndexComponent',

  propTypes: {
    state: PropTypes.object.isRequired,
  },

  contextTypes: {
    executeAction: PropTypes.func.isRequired,
  },

  componentWillMount() {
    style.use();
  },

  componentWillUnmount() {
    style.unuse();
  },

  render() {
    return (
      <div id="IndexComponent">
        <span>current status is {this.props.state.example_state ? 'on' : 'off'}</span>
        <div id="IndexComponentButton1" className="button">01 - ちんちん</div>
        <div id="IndexComponentButton2" className="button">02 - かもかも</div>
      </div>
    );
  },
});

IndexComponent = connectToStores(IndexComponent, ['StateStore'], (context) => {
  return {
    state: context.getStore('StateStore').getState(),
  };
});

export default IndexComponent;
