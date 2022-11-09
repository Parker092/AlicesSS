import Vue from "vue";
import { http_client } from "../../plugins/http_client";

export default {
  namespaced: true,
  state: {
    alert: {
      show: false,
      type: "info",
      message: "",
      timeout: 2500,
    },
    loader: false,
    sideBar: false,
    menu: [],
    rutas: [],
  },
  getters: {
    getAlert: (state) => {
      return state.alert;
    },
  },
  mutations: {
    setAlert: (state, payload) => {
      state.alert = payload;
    },
    setLoader: (state, payload) => {
      state.loader = payload;
    },
    setSibeBar: (state, payload) => {
      state.sideBar = payload;
    },
    setMenu: (state, menu) => {
      state.menu = menu;
    },
    setRutas: (state, rutas) => {
      state.rutas = rutas;
    },
  },
  actions: {
    setAlert: ({ commit }, payload) => {
      commit("setAlert", payload);
    },
    getMenu: async ({ commit }) => {
      try {
        const response = await http_client("/api/v1/rutas/get-rutas");
        const menu = response.data.filter((item) => item.mostrar === true);
        commit("setMenu", menu);
        commit("setRutas", response.data);
      } catch (e) {
        Vue.prototype.temporalAlert({
          show: true,
          message: e.response.data.message,
          type: "error",
        });
      }
    },
    clearMenu: ({ commit }) => {
      commit("setMenu", []);
      commit("setRutas", []);
    },
  },
};
