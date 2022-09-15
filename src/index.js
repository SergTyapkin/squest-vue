import { createApp } from 'vue'

import App from './App.vue'
import Store from './Store.js'
import createVueRouter, {BASE_URL_PATH} from './Router.js'
import Api from "./Api";

import './styles/buttons.styl';

import './styles/global.styl';
import './styles/show-hide.styl';
import './styles/scrollbars.styl';
import {API_URL} from "./constants";


const app = createApp(App)
  .use(Api, API_URL)
  .use(createVueRouter(Store))
  .use(Store)
  .mount('#app');
Store.$app = app;
