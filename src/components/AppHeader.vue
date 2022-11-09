<template>
  <v-app-bar app :elevation="1" color="background" dense>
    <v-btn
      text
      icon
      @click.stop="setSibeBar(!sideBar)"
      color="primary"
      v-if="!$vuetify.breakpoint.smAndDown"
    >
      <v-icon>mdi-menu</v-icon>
    </v-btn>
    <v-spacer></v-spacer>

    <v-menu offset-y transition="scroll-y-transition" rounded="lg">
      <template v-slot:activator="{ on, attrs }">
        <v-btn v-bind="attrs" v-on="on" elevation="0" text small>
          {{ userDetail }}
          <v-icon>mdi-chevron-down</v-icon>
        </v-btn>
      </template>
      <v-list dense nav>
        <v-list-item @click="cerrarSession()" class="my-0">
          <v-list-item-icon>
            <v-icon size="20">mdi-logout</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Cerrar Sesión</v-list-item-title>
        </v-list-item>
        <v-list-item class="my-0">
          <v-list-item-icon>
            <v-switch
              v-model="$vuetify.theme.dark"
              class="my-0"
              hint="This toggles the global state of the Vuetify theme"
              dense
            ></v-switch>
          </v-list-item-icon>
          <v-list-item-title>Tema Oscuro </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script>
import { mapMutations, mapState } from "vuex";

export default {
  name: "AppHeader",
  methods: {
    ...mapMutations("utils", ["setSibeBar", "setMenu"]),
    ...mapMutations(["setToken", "setUserInfo"]),
    async cerrarSession() {
      try {
        const response = await this.http_client("/api/logout", {}, "post");
        if (response) {
          this.temporalAlert({
            show: true,
            message: response.data.message || "Sesion cerrada",
            type: "info",
          });
        }
      } catch (error) {
        this.temporalAlert({
          show: true,
          message: error.response.data.message || "No autenticado",
          type: "info",
        });
      }
      this.setToken(null);
      localStorage.clear();
      this.$router.push("/login").catch((e) => {});
    },
  },
  computed: {
    ...mapState(["userInfo", "userDetail"]),
    ...mapState("utils", {
      sideBar: "sideBar",
    }),
  },
};
</script>

<style scoped></style>
