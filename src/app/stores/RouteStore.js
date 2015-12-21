import { RouteStore } from 'fluxible-router';

export default RouteStore.withStaticRoutes({
  index: {
    path: '/',
    method: 'get',
    handler: require('../components/IndexComponent'),
  },
  info: {
    path: '/information',
    method: 'get',
    handler: require('../components/InfoComponent'),
  },
});
