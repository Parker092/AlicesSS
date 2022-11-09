<template>
  <v-app>
    <v-main class="about">
      <v-container fluid fill-height>
        <v-row class="text-center">
          <v-col cols="12"> </v-col>
          <v-col cols="12">
            <p :class="dinamicClass">Hay un problema | 404 Page Not Found</p>
            <v-btn
              color="primary"
              class="mt-8"
              rounded
              @click="ejecutarMover()"
              text
              id="botomAction"
              style="text-transform: none"
              large
            >
              <p class="text-h6 ma-0">Regresar al login</p>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>
<script>
export default {
  name: "About",
  data: () => ({
    move: 0,
    interval: null,
  }),
  methods: {
    mover() {
      this.move = this.move + 10;
    },
    ejecutarMover() {
      // const btn = document.getElementById('botomAction')
      // const x = document.getElementById('botomAction').getBoundingClientRect()
      // const ancho=screen.width
      // let positionX = 0
      // let interval=setInterval(() => {
      //     positionX  = btn.getBoundingClientRect().x
      //     if( positionX < ancho){
      //       this.mover()
      //     }else{
      //       this.move = x
      //       clearInterval(interval)
      //       this.ejecutarMover()
      //     }
      //   },1)
      this.$router.push("/login");
    },
  },
  computed: {
    dinamicClass() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return "text-h6";
        case "sm":
          return "text-h6";
        case "md":
          return "text-h4";
        case "lg":
          return "text-h2";
        case "xl":
          return "text-h2";
        case "2xl":
          return "text-h2";
      }
    },
    dinamicSize() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return 300;
        case "sm":
          return 300;
        case "md":
          return 400;
        case "lg":
          return 500;
        case "xl":
          return 500;
        case "2xl":
          return 700;
      }
    },
  },
};
</script>
