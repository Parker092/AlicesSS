import Vue from "vue";
import Vuetify from "vuetify/lib/framework";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: "#FFA1CF",
        accent: "#FF74B1",
        light: "#FFD6EC",
        background: "#F9F9F9",
        bgWhite: "#FFFFFF",
      },
      dark: {
        background: "#2f3032",
        primary: "#FFA1CF",
        light: "#FFD6EC",
        accent: "#FF74B1",
      },
    },
  },
});
