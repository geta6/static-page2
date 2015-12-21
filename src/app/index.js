import 'babel-core/polyfill';
import './index.styl';
import $ from 'jquery';
import image from './image.png';

const expand = (expr) => {
  $(expr).addClass('expand');
};

const routes = {
  '/': () => {
  },

  '/info': () => {
    expand('.menu1 .image');
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
  $('.menu').each(function menu() {
    $(this).find('.image').css({'background-image': `url(${image})`});
  });
});
