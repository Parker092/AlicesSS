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
              <v-form @submit.prevent="register()">
                <v-card-text>
                  <v-text-field
                    append-icon="mdi-account"
                    name="login"
                    label="Nombre Completo"
                    type="text"
                    v-model="name"
                    :rules="nameRules"
                  >
                  </v-text-field>
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
                    v-model="password"
                    label="Contraseña *"
                    :type="showPassword ? 'text' : 'password'"
                    :rules="passwordRules"
                  >
                    <template #append>
                      <v-icon
                        v-if="!showPassword"
                        @click="showPassword = !showPassword"
                        :color="error ? 'red' : ''"
                        >mdi-eye</v-icon
                      >
                      <v-icon
                        v-else
                        @click="showPassword = !showPassword"
                        :color="error ? 'red' : ''"
                        >mdi-eye-off</v-icon
                      >
                    </template>
                  </v-text-field>
                  <v-text-field
                    append-icon="mdi-eye"
                    v-model="passwordConfirm"
                    label="Confirmar Contraseña *"
                    :type="showPasswordConfirm ? 'text' : 'password'"
                    :rules="passwordRules"
                  >
                    <template #append>
                      <v-icon
                        v-if="!showPasswordConfirm"
                        @click="showPasswordConfirm = !showPasswordConfirm"
                        :color="error ? 'red' : ''"
                        >mdi-eye</v-icon
                      >
                      <v-icon
                        v-else
                        @click="showPasswordConfirm = !showPasswordConfirm"
                        :color="error ? 'red' : ''"
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
                  <v-btn color="primary " type="submit">Registrarse</v-btn>
                  <v-btn color="primary" :to="'/login'" text
                    >iniciar sesión</v-btn
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
import store from "../store";

export default {
  name: "login",
  data: () => ({
    error: false,
    user: null,
    name: null,
    password: null,
    passwordConfirm: null,
    passwordRules: [(v) => (v !== null && v !== "") || "Contraseña no valida"],
    showPassword: false,
    showPasswordConfirm: false,
    disabled: false,
  }),
  methods: {
    ...mapMutations(["setToken", "setUserInfo"]),
    cleanMail(e) {
      if (e.keyCode === 32) {
        e.preventDefault();
      }
    },
    async register() {
      this.showLoader();
      if (!this.user || !this.password) {
        return;
      }
      if (this.password !== this.passwordConfirm) {
        this.temporalAlert({
          show: true,
          message: "las contraseñas tienen que ser iguales",
          type: "error",
        });
        return;
      }
      try {
        let data = {
          name: this.name,
          email: this.user,
          password: this.password,
          password_confirmation: this.passwordConfirm,
        };
        let response = await this.http_client("/api/register", data, "post");
        if (response) {
          this.temporalAlert({
            show: true,
            message: "Usuario creado con exito",
            type: "success",
          });
          localStorage.setItem("token", response.data.data.access_token);
          localStorage.setItem("user", response.data.data.user.email);
          this.setToken(response.data.data.access_token);
          this.setUserInfo(response.data.data.user);
          this.$router.push("/");
        }
      } catch (e) {
        console.log(e);
        this.temporalAlert({
          show: true,
          message: "An error has occured",
          type: "error",
        });
      } finally {
        this.hideLoader();
      }
    },
  },
  computed: {
    userRules() {
      return [
        (v) => (v !== null && v !== "") || "Este campo es requerido",
        (v) => this.isEmail(v) || "Correo no válido",
      ];
    },
    nameRules() {
      return [(v) => (v !== null && v !== "") || "Este campo es requerido"];
    },
  },
  created() {
    store.commit("utils/setRutas", []);
    localStorage.clear();
  },
};
</script>

<style scoped></style>
