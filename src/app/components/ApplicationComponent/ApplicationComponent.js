import get from 'lodash/object/get';
import React, { PropTypes } from 'react';
import { provideContext, connectToStores } from 'fluxible-addons-react';
import { handleHistory } from 'fluxible-router';
import style from './ApplicationComponent.styl';

let ApplicationComponent = React.createClass({
  displayName: 'ApplicationComponent',

  propTypes: {
    context: PropTypes.object,
    currentState: PropTypes.object,
    currentRoute: PropTypes.object,
  },

  contextTypes: {
    getStore: PropTypes.func.isRequired,
    executeAction: PropTypes.func.isRequired,
  },

  componentWillMount() {
    style.use();
  },

  componentWillUnmount() {
    style.unuse();
  },

  render() {
    const RouteHandler = get(this.props.currentRoute, ['handler']);
    return (
      <div id="ApplicationComponent">
        {RouteHandler && <RouteHandler />}
      </div>
    );
  },
});

ApplicationComponent = connectToStores(ApplicationComponent, ['StateStore', 'RouteStore'], context => {
  return {
    currentState: context.getStore('StateStore').getState(),
    currentRoute: context.getStore('RouteStore').getCurrentRoute(),
  };
});

ApplicationComponent = handleHistory(ApplicationComponent, {
  checkRouteOnPageLoad: true,
});

ApplicationComponent = provideContext(ApplicationComponent);

export default ApplicationComponent;
