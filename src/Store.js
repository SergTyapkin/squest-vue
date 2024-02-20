import Vuex from 'vuex'
import User from "./models/user";
import {QuestModes, Themes} from "~/constants";

const Store = new Vuex.Store({
  state: {
    user: new User(),
    theme: Themes.default,
  },
  mutations: {
    SET_USER(state, userData) {
      state.user.set(userData);
    },
    DELETE_USER(state) {
      state.user.setDefault();
    },
    SET_THEME(state, theme) {
      state.theme = theme || Themes.default;
    },
  },
  actions: {
    async GET_USER(state) {
      const u = await this.$app.$api.getUser();
      const p = await this.$app.$api.getPlay();
      if (u.ok_) {
        state.commit('SET_USER', {
          avatarimageid: u.avatarimageid,
          chosenbranchid: u.chosenbranchid,
          chosenbranch: u.chosenbranch,
          chosenquestid: u.chosenquestid,
          chosenquest: u.chosenquest,
          chosenmode: u.chosenmode,
          email: u.email,
          id: u.id,
          isAdmin: u.isadmin,
          isConfirmed: u.isconfirmed,
          joinedDate: u.joineddate,
          name: u.name,
          username: u.username,
          position: u.position,
          rating: u.rating,
          createdquests: u.createdquests,
          completedbranches: u.completedbranches,
          progress: p.progress,
          progressMax: p.length,
          temporaryToQuestId: u.temporarytoquestid,
        });
        state.commit('SET_THEME', u.chosenmode === QuestModes.fast ? Themes.flat : Themes.default);
      } else {
        state.commit('DELETE_USER');
      }
    },
    DELETE_USER(state) {
      state.commit('DELETE_USER');
      state.commit('SET_THEME', Themes.default);
    },
    SET_THEME(state, theme) {
      state.commit('SET_THEME', theme);
    },
  }
});

export default Store;
