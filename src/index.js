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

const app = createApp(App)
  .use(Api, API_URL)
  .use(Store);
Store.$app = app;

const Router = createVueRouter(Store, app);
app.use(Router)

app.mount('#app');
