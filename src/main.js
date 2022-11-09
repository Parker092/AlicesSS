import Vue from "vue";
import "./plugins/http_client";
import "./plugins/utils";
import "./assets/scss/variables.scss";

import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import VueMask from "v-mask";
import { VueMaskFilter } from "v-mask";

const moment = require("moment");
require("moment/locale/es");
import momentTime from "moment-timezone";

import { regComponents } from "@/modules/utils/regComponents";
regComponents(Vue);
Vue.prototype.moment = moment;
Vue.use(require("vue-moment"), {
  moment,
  momentTime,
});

Vue.use(VueMask);
Vue.filter("VMask", VueMaskFilter);
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  beforeCreate() {
    const token = localStorage.getItem("token");
    if (token) store.commit("setToken", token);
  },
  render: (h) => h(App),
}).$mount("#app");
