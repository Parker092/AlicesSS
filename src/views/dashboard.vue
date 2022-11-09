<template>
  <v-container class="pa-0 pa-sm-2 justify-center d-flex" fill-height fluid>
    <v-flex xs12 sm10>
      <v-card elevation="0" class="pa-5">
        <v-alert color="primary" text type="info" prominent>
          No hay datos
        </v-alert>
      </v-card>
    </v-flex>
  </v-container>
</template>
<script>
import { mapActions, mapState } from "vuex";
export default {
  data: () => ({}),
  methods: {},
  async created() {},
};
</script>
