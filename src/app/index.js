import 'babel-core/polyfill';
import './index.styl';
import $ from 'jquery';
import image from './image.png';

const routes = {
  '/': () => {
    alert('index');
  },

  '/info': () => {
    console.log('いんふぉ');
  },
};

const routing = () => {
  const hash = location.hash.replace(/^\#\!/, '') || '/';
  routes[hash] && routes[hash]();
};

$(window).on('hashchange', routing);

$(() => {
  routing();
});
