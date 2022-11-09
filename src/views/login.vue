<template>
  <v-app class="background">
    <v-main>
      <v-container fluid fill-height>
        <v-layout justify-center align-center>
          <v-flex xs12 sm8 md6 lg4 xl3>
            <v-img class="mx-auto d-flex mb-2" max-width="350" />
            <v-card class="pa-2 pa-sm-10" rounded="lg" :elevation="5">
              <p class="text-h5 text-center pt-5 accent--text">
                Iniciar sesion
              </p>
              <v-form @submit.prevent="login()">
                <v-card-text>
                  <v-text-field
                    append-icon="mdi-account"
                    name="login"
                    label="Usuario / Correo Electronico *"
                    type="text"
                    @keydown="cleanMail"
                    v-model="user"
                    :rules="userRules"
                  >
                  </v-text-field>
                  <v-text-field
                    append-icon="mdi-eye"
                    id="password"
                    name="password"
                    v-model="password"
                    label="Contraseña *"
                    :type="showPassword ? 'text' : 'password'"
                    :rules="passwordRules"
                  >
                    <template #append>
                      <v-icon
                        v-if="!showPassword"
                        @click="showPassword = !showPassword"
                        >mdi-eye</v-icon
                      >
                      <v-icon v-else @click="showPassword = !showPassword"
                        >mdi-eye-off</v-icon
                      >
                    </template>
                  </v-text-field>
                </v-card-text>
                <v-col
                  cols="12"
                  md="6"
                  class="flex justify-center text-center mx-auto"
                >
                  <v-btn color="primary" type="submit">iniciar sesión</v-btn>
                  <v-btn color="primary " text :to="'/register'"
                    >Registrarse</v-btn
                  >
                </v-col>
              </v-form>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-main>
    <v-footer class="text-center accent py-3">
      <v-row justify="center">
        <v-col
          class="text-center white--text font-weight-bold align-center"
          cols="12"
          sm="6"
          md="4"
        >
          <p class="ma-0">Ministerio de Salud <br /></p>
        </v-col>
      </v-row>
    </v-footer>
  </v-app>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import jwtDecode from "jwt-decode";
import store from "../store";

export default {
  name: "login",
  data: () => ({
    user: null,
    password: null,
    passwordRules: [(v) => (v !== null && v !== "") || "Contraseña no valida"],
    showPassword: false,
  }),
  methods: {
    ...mapMutations(["setToken", "setUserInfo"]),
    cleanMail(e) {
      if (e.keyCode === 32) {
        e.preventDefault();
      }
    },
    async login() {
      this.showLoader();
      if (!this.user || !this.password) {
        return;
      }
      try {
        let data = {
          email: this.user,
          password: this.password,
        };
        let response = await this.http_client("/api/login", data, "post");
        if (response?.status === 200) {
          localStorage.setItem("token", response.data.data.access_token);
          localStorage.setItem("user", response.data.data.user.email);
          this.setToken(response.data.data.access_token);
          this.setUserInfo(response.data.data.user);
          this.$router.push("/");
        }
      } catch (e) {
        this.temporalAlert({
          show: true,
          message: "El correo electrónico o la contraseña no son validos",
          type: "error",
        });
      } finally {
        this.hideLoader();
      }
    },
    showAlert(message) {
      this.alert.show = true;
      this.alert.message = message;
      this.alert.type = "success";
      setTimeout(() => {
        this.ocultarAlert();
      }, 2000);
    },
    ocultarAlert() {
      this.alert.show = !this.alert.show;
    },
  },
  computed: {
    userRules() {
      return [
        (v) => (v !== null && v !== "") || "Este campo es requerido",
        (v) => this.isEmail(v) || "Correo no válido",
      ];
    },
  },
  created() {
    store.commit("utils/setRutas", []);
    localStorage.clear();
  },
};
</script>

<style scoped></style>
