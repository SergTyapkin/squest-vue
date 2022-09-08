import { createRouter, createWebHistory } from 'vue-router'

import SignIn from '/src/views/User/SignIn.vue'
import SignUp from '/src/views/User/SignUp.vue'
import Profile from '/src/views/User/Profile.vue'
import Page404 from '/src/views/Page404.vue'
import About from "/src/views/About.vue";
import Quests from "/src/views/Quests.vue";
import Quest from "/src/views/Quest.vue";
import Play from "/src/views/Play.vue";

export const BASE_URL_PATH = '';

export default function createVueRouter(Store) {
    const routes = [
        {path: BASE_URL_PATH + '/', component: About},

        {path: BASE_URL_PATH + '/signin', component: SignIn, meta: {noLoginRequired: true}},
        {path: BASE_URL_PATH + '/signup', component: SignUp, meta: {noLoginRequired: true}},
        {path: BASE_URL_PATH + '/profile', component: Profile, meta: {loginRequired: true}},

        {path: BASE_URL_PATH + '/play', component: Play},

        {path: BASE_URL_PATH + '/quests', component: Quests},
        {path: BASE_URL_PATH + '/quests/my', component: Quests, meta: {loginRequired: true}},
        {path: BASE_URL_PATH + '/quests/create', component: Quests, meta: {loginRequired: true}},
        {path: BASE_URL_PATH + '/quests/change', component: Quests, meta: {loginRequired: true}},

        {path: BASE_URL_PATH + '/quest', component: Quest},

        {path: BASE_URL_PATH + '/:catchAll(.*)', component: Page404}
    ]

    const Router = createRouter({
        history: createWebHistory(),
        routes: routes,
    });

    let router_got_user = false
    Router.beforeEach(async (to, from, next) => {
        if (!router_got_user) {
            await Store.dispatch('GET_USER');
            router_got_user = true;
        }

        const baseBartRedirect = {
            path: BASE_URL_PATH + removeBasePartOnStart(to.fullPath),
        }
        const notLoginedRedirect = {
            path: BASE_URL_PATH + '/signin',
        }
        const loginedRedirect = {
            path: BASE_URL_PATH + '/profile',
        }

        function smartBasePartRedirect() {
            if (isStartsOnBasePart(to.fullPath))
                next();
            else
                next(baseBartRedirect);
        }

        if (to.matched.some(record => record.meta.loginRequired)) {
            if (Store.state.user.isLogined) {
                smartBasePartRedirect();
                return;
            }
            next(notLoginedRedirect);
            return;
        } else if (to.matched.some(record => record.meta.noLoginRequired)) {
            if (!Store.state.user.isLogined) {
                smartBasePartRedirect();
                return;
            }
            next(loginedRedirect);
            return;
        }
        smartBasePartRedirect();
    });

    return Router;
}

function isStartsOnBasePart(string) {
    return new RegExp(`^${BASE_URL_PATH}`, 'i').test(string);
}
function removeBasePartOnStart(string) {
    return string.replace(new RegExp(`^${BASE_URL_PATH}`, 'i'), '');
}
