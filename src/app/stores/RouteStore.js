import { RouteStore } from 'fluxible-router';

export default RouteStore.withStaticRoutes({
  index: {
    path: '/',
    method: 'get',
    handler: require('../components/IndexComponent'),
  },
});
