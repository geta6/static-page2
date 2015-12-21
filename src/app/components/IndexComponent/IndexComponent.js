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

  handleOn() {
    this.context.executeAction(StateAction, {
      type: StateAction.actionTypes.setState,
      entity: { state: { example_state: true } },
    });
  },

  handleOff() {
    this.context.executeAction(StateAction, {
      type: StateAction.actionTypes.setState,
      entity: { state: { example_state: false } },
    });
  },

  render() {
    return (
      <div id="IndexComponent">
        <span>current status is {this.props.state.example_state ? 'on' : 'off'}</span>
        <button onClick={this.handleOn}>ON</button>
        <button onClick={this.handleOff}>OFF</button>
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
