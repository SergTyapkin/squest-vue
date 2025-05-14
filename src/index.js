import { createApp } from 'vue';

import App from './App.vue';
import Store from './Store.js'
import createVueRouter from './Router.js'

import './styles/fontsLoader.styl';
import './styles/global.styl';
import './styles/show-hide.styl';
import './styles/scrollbars.styl';
import './styles/buttons.styl';
import swAPI from './serviceWorker/swAPI';
import {API_URL} from "./constants";
import Api from "./Api";


await swAPI.register();

const app = createApp(App)
  .use(Api, API_URL)
  .use(Store);
Store.$app = app;

const Router = createVueRouter(Store, app);
app.use(Router)

app.mount('#app');
