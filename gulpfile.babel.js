import cp from 'child_process';
import fs from 'fs';
import path from 'path';
import gulp from 'gulp';
import util from 'gulp-util';
import chalk from 'chalk';
import ncp from 'ncp';
import gaze from 'gaze';
import del from 'del';
import run from 'run-sequence';
import webpack from 'webpack';
import pick from 'lodash/object/pick';
import defaults from 'lodash/object/defaults';
import browserSync from 'browser-sync';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

/**
 * Environments and constants.
 */
const DEBUG = !(process.argv.includes('--release') || process.argv.includes('release'));
const WATCH = process.argv.includes('--watch') || process.argv.includes('watch');

defaults(process.env, {
  NODE_ENV: DEBUG ? 'development' : 'production',
});

util.log(chalk.green(`NODE_ENV:  ${process.env.NODE_ENV}`));
util.log(chalk.green(`DEBUG:     ${DEBUG ? 'on' : 'off'}`));
util.log(chalk.green(`WATCH:     ${WATCH ? 'on' : 'off'}`));

const browser = WATCH ? browserSync.create() : null;

/**
 * Helper functions.
 */
const copy = (source, destination) => new Promise((resolve, reject) => {
  ncp(source, destination, err => err ? reject(err) : resolve());
});

const watch = pattern => new Promise((resolve, reject) => {
  gaze(pattern, (err, watcher) => err ? reject(err) : resolve(watcher));
});

const read = (file, encoding) => new Promise((resolve, reject) => {
  fs.readFile(file, encoding, (err, data) => err ? reject(err) : resolve(data));
});

const write = (file, data) => new Promise((resolve, reject) => {
  fs.writeFile(file, data, err => err ? reject(err) : resolve());
});

/**
 * Compiles the project from source files into a distributable format and copies it to the output (build) folder.
 */
gulp.task('build', async () => {
  await new Promise(resolve => run('clean', 'copy', 'bundle', resolve));
});

/**
 * Cleans up the output (build) directory.
 */
gulp.task('clean', async () => {
  await del(['build/*'], { dot: false });
});

/**
 * Copies static files to the output (build) folder.
 */
gulp.task('copy', async () => {
  await Promise.all([
    copy('src/app/index.html', 'build/index.html'),
  ]);

  const info = Object.assign(JSON.parse(await read('./package.json')), {
    name: process.env.NODE_ENV === 'production' ? `StaticPage` : `StaticPage-${process.env.NODE_ENV}`,
    main: './bundle.js',
  });

  await write('build/package.json', JSON.stringify(pick(info, ['name', 'version', 'main'])));

  if (WATCH) {
    const watcher = await watch('src/app/**/*.html');
    watcher.on('changed', async file => {
      util.log('[changed]', file);
      await copy(file, `build/${path.basename(file)}`);
      browser.reload();
    });
  }
});

/**
 * Bundles JavaScript into one or more packages ready to be used in a browser.
 */
gulp.task('bundle', async () => {
  const config = require('./webpack.config.babel');

  await new Promise((resolve, reject) => {
    let count = 0;
    const bundler = webpack(config);
    const bundle = (err, stats) => {
      if (err) {
        reject(new util.PluginError('bundle', err.message));
      } else {
        util.log(stats.toString(config[0].stats));
        if (++count === (WATCH ? config.length : 1)) {
          resolve();
        }
      }
    };

    WATCH ? bundler.watch(200, bundle) : bundler.run(bundle);
  });
});

gulp.task('start', async () => {
  const config = require('./webpack.config.babel')[0];
  const bundler = webpack(config);

  cp.spawn('node', ['./src/server.js']);

  await new Promise(resolve => run('build', resolve));

  browser.init({
    ui: false,
    notify: false,
    ghostMode: false,

    proxy: {
      target: 'localhost:3000',
      middleware: [
        webpackDevMiddleware(bundler, { publicPath: config.output.publicPath, stats: config.stats }),
        webpackHotMiddleware(bundler),
      ],
    },

    files: [
      'build/public/**/*.css',
      'build/public/**/*.html',
    ],
  });
});
