<template>
  <v-app>
    <app-loader v-if="loader"></app-loader>

    <app-header></app-header>
    <app-aside-bar :menu="menu"></app-aside-bar>
    <v-main class="">
      <!-- <app-menu /> -->
      <div class="pa-0 pa-sm-4" v-if="userDetail">
        <router-view :key="$route.path" />
      </div>
    </v-main>
  </v-app>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import jwtDecode from "jwt-decode";

export default {
  name: "layout",
  data: () => ({}),
  methods: {
    ...mapMutations(["setUserInfo", "setUserDetail"]),
    ...mapActions(["getUserDetail"]),
  },
  computed: {
    ...mapState({
      userInfo: "userInfo",
      token: "token",
      userDetail: "userDetail",
    }),
    ...mapState("utils", ["loader", "menu"]),
  },
  async created() {
    var userToken = this.token || localStorage.getItem("token");
    if (userToken) {
      const userInfo = localStorage.getItem("user");
      this.setUserDetail(userInfo);
    } else {
      this.$router.push("/login").catch((e) => {});
    }
  },
};
</script>

<style scoped></style>
