import { createApp } from 'vue'

import App from './App.vue'
import Store from './Store.js'
import createVueRouter from './Router.js'
import Api from "./Api";

import './styles/buttons.styl';
import './styles/global.styl';
import './styles/show-hide.styl';
import './styles/scrollbars.styl';
import './styles/fontsLoader.styl';
import {API_URL} from "./constants";

const Router = createVueRouter(Store);
const app = createApp(App)
  .use(Api, API_URL)
  .use(Router)
  .use(Store)
  .mount('#app');
Store.$app = app;
