<template>
  <v-navigation-drawer
    app
    permanent
    stateless
    color="accent"
    :class="sideBar ? 'px-0' : 'px-2'"
    :mini-variant="sideBar"
    :mini-variant-width="$vuetify.breakpoint.smAndDown ? 45 : 70"
    @input="setSibeBar($event)"
  >
    <template v-slot:prepend>
      <v-card
        elevation="2"
        class="ma-4 py-0"
        color="light"
        v-if="!sideBar"
        :to="'/'"
      >
        <v-card-title>
          <h1 class="text-no-wrap">Inicio</h1>
        </v-card-title>
      </v-card>
      <v-list-item v-else two-line>
        <v-btn text icon x-large color="light"
          ><v-icon size="30">mdi-home</v-icon></v-btn
        >
      </v-list-item>
    </template>

    <v-list dense nav>
      <v-list-item
        v-for="(child, j) in menuItems"
        :key="j"
        :to="child.uri"
        class="light--text"
        active-class="light--text text--lighten-1"
      >
        <v-list-item-icon>
          <v-icon>{{ child.icono }}</v-icon>
        </v-list-item-icon>
        <v-list-item-title class="text-capitalize">
          <span>{{ child.nombre }}</span>
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapMutations, mapState } from "vuex";

export default {
  name: "AppAsideBar",
  props: {
    menuItems: {
      type: Array,
      default: () => {
        return [
          {
            uri: "/",
            icono: "mdi-list-box",
            nombre: "Productos",
          },
          { uri: "/citas", icono: "mdi-calendar-account", nombre: "Citas" },
        ];
      },
    },
  },
  data: () => ({}),
  methods: {
    ...mapMutations("utils", ["setSibeBar"]),
  },
  computed: {
    ...mapState("utils", ["sideBar"]),
  },
};
</script>

<style scoped></style>
