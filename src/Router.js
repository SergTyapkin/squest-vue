import { createRouter, createWebHistory } from 'vue-router'

import SignIn from '/src/views/User/SignIn.vue'
import SignUp from '/src/views/User/SignUp.vue'
import Profile from '/src/views/User/Profile.vue'
import Page404 from '/src/views/Page404.vue'
import About from "/src/views/About.vue";
import Quests from "/src/views/Quests.vue";
import MyQuests from "/src/views/MyQuests.vue";
import QuestEdit from "/src/views/QuestEdit.vue";
import QuestCreate from "/src/views/QuestCreate.vue";
import BranchEdit from "/src/views/BranchEdit.vue";
import TaskEdit from "/src/views/TaskEdit.vue";
import Quest from "/src/views/Quest.vue";
import Play from "/src/views/Play.vue";
import Ratings from "/src/views/Ratings.vue";
import Admin from "/src/views/Admin.vue";
import FoundQR from "/src/views/FoundQR.vue";
import {BASE_URL_PATH} from "./constants";


export default function createVueRouter(Store) {
    const routes = [
        {path: BASE_URL_PATH + '/', component: About},

        {path: BASE_URL_PATH + '/signin', component: SignIn, meta: {noLoginRequired: true}},
        {path: BASE_URL_PATH + '/signup', component: SignUp, meta: {noLoginRequired: true}},
        {path: BASE_URL_PATH + '/profile', component: Profile, meta: {loginRequired: true}},

        {path: BASE_URL_PATH + '/play', component: Play},

        {path: BASE_URL_PATH + '/quests', component: Quests},
        {path: BASE_URL_PATH + '/quests/my', component: MyQuests, meta: {loginRequired: true}},

        {path: BASE_URL_PATH + '/quest/create', component: QuestCreate, meta: {loginRequired: true}},

        {path: BASE_URL_PATH + '/quest', component: Quest},
        {path: BASE_URL_PATH + '/quest/edit', component: QuestEdit, meta: {loginRequired: true}},
        {path: BASE_URL_PATH + '/quest/branch/edit', component: BranchEdit, meta: {loginRequired: true}},
        {path: BASE_URL_PATH + '/quest/branch/task/edit', component: TaskEdit, meta: {loginRequired: true}},

        {path: BASE_URL_PATH + '/ratings', component: Ratings},
        {path: BASE_URL_PATH + '/admin', component: Admin, meta: {loginRequired: true}},
        {path: BASE_URL_PATH + '/qr/:data', component: FoundQR},

        {path: BASE_URL_PATH + '/:catchAll(.*)', component: Page404}
    ]

    const Router = createRouter({
        history: createWebHistory(),
        routes: routes,
    });

    let router_got_user = false;
    Router.beforeEach(async (to, from, next) => {
        if (!router_got_user) {
            await Store.dispatch('GET_USER');
            router_got_user = true;
        }
        // window.scroll({top: 0, left: 0, behavior: 'smooth'});

        const basePartRedirect = {
            path: BASE_URL_PATH + removeBasePartOnStart(to.fullPath),
            params: to.params,
            query: to.query,
        }
        const notLoginedRedirect = {
            path: BASE_URL_PATH + '/signin',
        }
        const loginedRedirect = {
            path: BASE_URL_PATH + '/profile',
        }

        function smartBasePartRedirect() {
            if (isStartsOnBasePart(to.fullPath)) {
                next();
            } else {
                next(basePartRedirect);
            }
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
        return;
    });
    Router.beforeResolve(async (to) => {
        if (window?.onbeforeunload) {
            if (confirm("Изменения не сохранены. Вы уверены, что хотите покинуть страницу?"))
                window.onbeforeunload = null;
            else
                return false;
        }
    });


    return Router;
}


function isStartsOnBasePart(string) {
    return new RegExp(`^${BASE_URL_PATH}`, 'i').test(string);
}
function removeBasePartOnStart(string) {
    return string.replace(new RegExp(`^${BASE_URL_PATH}`, 'i'), '');
}
