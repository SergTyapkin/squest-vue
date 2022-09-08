import Vuex from 'vuex'
import User from "./models/user";

const Store = new Vuex.Store({
  state: {
    user: new User(),
  },
  mutations: {
    SET_USER(state, userData) {
      state.user.set(userData);
    },
    DELETE_USER(state) {
      state.user.setDefault();
    },
  },
  actions: {
    async GET_USER(state) {
      const u = await this.$app.$api.getUser();
      if (u.ok_)
        state.commit('SET_USER', {
          avatarUrl: u.avatarurl,
          chosenBranchId: u.chosenbranchid,
          chosenBranch: u.chosenbranch,
          chosenQuestId: u.chosenquestid,
          chosenQuest: u.chosenquest,
          email: u.email,
          id: u.id,
          isAdmin: u.isadmin,
          isConfirmed: u.isconfirmed,
          joinedDate: u.joineddate,
          name: u.name,
          username: u.username,
        });
      else
        state.commit('DELETE_USER');
    },
    async DELETE_USER(state) {
      state.commit('DELETE_USER');
    },
  }
});

export default Store;
