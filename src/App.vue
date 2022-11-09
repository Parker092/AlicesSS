<template>
  <v-app>
    <v-main class="pa-0 ma-0 myFont">
      <v-fade-transition>
        <v-snackbar
          v-model="alert().show"
          :value="alert().show"
          v-if="alert().show"
          :timeout="alert().timeout"
          top
          class="fixed"
          z-index="10"
          text
          tile
          elevation="1"
          :color="alert().type"
          right
        >
          <v-icon color="success" left v-if="alert().type === 'success'"
            >mdi-check-circle</v-icon
          >
          <v-icon color="error" left v-if="alert().type === 'error'"
            >mdi-alert-octagon</v-icon
          >
          <v-icon color="warning" left v-if="alert().type === 'warning'"
            >mdi-alert</v-icon
          >
          <v-icon color="info" left v-if="alert().type === 'info'"
            >mdi-information</v-icon
          >
          <span class="body-1"
            ><strong> {{ alert().message }}</strong></span
          >

          <template #action="{ attrs }">
            <v-btn v-bind="attrs" icon right @click="alert().show = false"
              ><v-icon small>mdi-close</v-icon></v-btn
            >
          </template>
        </v-snackbar></v-fade-transition
      >
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "App",

  data: () => ({
    drawer: null,
    opciones: [
      {
        title: "Perfil",
        icon: "mdi-account",
      },
      {
        title: "Cerrar Sesion",
        icon: "mdi-logout",
      },
    ],
  }),
  methods: {
    ...mapGetters({
      alert: "utils/getAlert",
    }),
  },
};
</script>
