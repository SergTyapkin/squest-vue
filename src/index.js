import { createApp } from 'vue'

import App from './App.vue'
import Store from './Store.js'
import createVueRouter from './Router.js'
import Api from "./Api";

import './styles/buttons.styl';
import './styles/listings.styl';

import './styles/global.styl';
import './styles/pages.styl';
import './styles/show-hide.styl';
import './styles/switches.styl';
import './styles/elements.styl';
import './styles/markdown-redactor.styl';
import './styles/scrollbars.styl';


const app = createApp(App)
  .use(Api, '/api')
  .use(createVueRouter(Store))
  .use(Store)
  .mount('#app');
Store.$app = app;
