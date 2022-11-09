import Vue from "vue";
import Vuex from "vuex";
import utils from "../modules/utils";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: null,
    userInfo: {},
    userDetail: {},
  },
  mutations: {
    setToken(state, payload) {
      state.token = payload;
    },
    setUserInfo(state, payload) {
      state.userInfo = payload;
    },
    setUserDetail(state, userDetail) {
      state.userDetail = userDetail;
    },
  },

  modules: {
    utils,
  },
});
