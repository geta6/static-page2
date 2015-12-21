import 'babel-core/polyfill';
import ReactDOM from 'react-dom';
import Fluxible from 'fluxible';
import { createElementWithContext } from 'fluxible-addons-react';

// create app
const app = new Fluxible({
  component: require('./components/ApplicationComponent'),
  stores: [
    require('./stores/StateStore'),
    require('./stores/RouteStore'),
  ],
});

app.rehydrate({}, (err, context) => {
  ReactDOM.render(createElementWithContext(context), document.getElementById('app'));
});
