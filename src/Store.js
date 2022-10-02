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
      const p = await this.$app.$api.getPlay();
      if (u.ok_)
        state.commit('SET_USER', {
          avatarimageid: u.avatarimageid,
          chosenbranchid: u.chosenbranchid,
          chosenbranch: u.chosenbranch,
          chosenquestid: u.chosenquestid,
          chosenquest: u.chosenquest,
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
