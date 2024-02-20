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
import RestorePassword from "./views/User/RestorePassword.vue";
import ConfirmEmail from "./views/User/ConfirmEmail.vue";
import UserQuests from "./views/UserQuests.vue";
import TakeQuest from "~/views/TakeQuest.vue";
import {BASE_URL_PATH, QuestModes} from "./constants";


export default function createVueRouter(Store, App) {
    const routes = [
        {path: BASE_URL_PATH + '/', name: 'default', component: About},

        {path: BASE_URL_PATH + '/signin', name: 'signin', component: SignIn, meta: {noLoginRequired: true}},
        {path: BASE_URL_PATH + '/signup', name: 'signup', component: SignUp, meta: {noLoginRequired: true}},
        {path: BASE_URL_PATH + '/profile', name: 'profile', component: Profile, meta: {loginRequired: true}},
        {path: BASE_URL_PATH + '/password/restore', name: 'password-restore', component: RestorePassword, meta: {noLoginRequired: true}},
        {path: BASE_URL_PATH + '/email/confirm', name: 'email-confirm', component: ConfirmEmail},

        {path: BASE_URL_PATH + '/play', name: 'play', component: Play},

        {path: BASE_URL_PATH + '/quests', name: 'quests', component: Quests},
        {path: BASE_URL_PATH + '/quests/user', name: 'user-quests', component: UserQuests},
        {path: BASE_URL_PATH + '/quests/my', name: 'my-quests', component: MyQuests, meta: {loginRequired: true}},

        {path: BASE_URL_PATH + '/quest/create', name: 'create-quest', component: QuestCreate, meta: {loginRequired: true, emailConfirmRequired: true}},
        {path: BASE_URL_PATH + '/quest/take', name: 'take-quest', component: TakeQuest},

        {path: BASE_URL_PATH + '/quest', name: 'quest', component: Quest},
        {path: BASE_URL_PATH + '/quest/edit', name: 'edit-quest', component: QuestEdit, meta: {loginRequired: true}},
        {path: BASE_URL_PATH + '/quest/branch/edit', name: 'edit-branch', component: BranchEdit, meta: {loginRequired: true}},
        {path: BASE_URL_PATH + '/quest/branch/task/edit', name: 'edit-task', component: TaskEdit, meta: {loginRequired: true}},

        {path: BASE_URL_PATH + '/ratings', name: 'ratings', component: Ratings},
        {path: BASE_URL_PATH + '/admin', name: 'admin', component: Admin, meta: {loginRequired: true}},
        {path: BASE_URL_PATH + '/qr/:data', name: 'qr', component: FoundQR},

        {path: BASE_URL_PATH + '/:catchAll(.*)', name: 'page404', component: Page404}
    ]

    const Router = createRouter({
        history: createWebHistory(),
        routes: routes,
    });

    let router_got_user = false;
    Router.beforeEach(async (to, from, next) => {
        if (!router_got_user) {
            await Store.dispatch('GET_USER');
            if (Store.state.user.chosenmode === QuestModes.fast) {
                if (to.name !== 'take-quest') {
                    next({name: 'play'});
                }
            }
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

        // Login required redirects
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

        // Email Confirm required handling
        if (to.matched.some(record => record.meta.emailConfirmRequired)) {
            if (!Store.state.user.isConfirmed) {
                App.$modal.alert("Действие недоступно", "Твой E-mail не подтвержден. Сперва нужно подтвердить его, сделать это можно в профиле")
                return false;
            }
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
