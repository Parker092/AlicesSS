<template>
  <v-container class="pa-0 pa-sm-2 justify-center d-flex" fill-height fluid>
    <v-flex xs12 sm10>
      <v-card elevation="0" class="pa-5">
        <v-row align="center" class="mb-10">
          <h1>Lista de citas</h1>
          <v-spacer></v-spacer>
          <v-btn color="accent" @click="openNewCitaModal()">Crear cita</v-btn>
        </v-row>
        <v-alert
          color="primary"
          text
          type="info"
          prominent
          v-if="citas.length === 0"
        >
          No hay datos
        </v-alert>
        <v-data-table
          v-else
          :items="citas"
          :headers="headers"
          no-data-text="No hay datos"
          :items-per-page.sync="rowsPerPage"
          :page.sync="currentPage"
          :footer-props="{
            'items-per-page-options': [5, 10, 15],
            'items-per-page-text': 'Filas',
            'page-text': '{0}-{1} de {2}',
          }"
        >
          <template #[`item.created_at`]="{ item }"
            >{{ moment(item.created_at).format("DD MMMM YYYY hh:mm A") }}
          </template>
          <template #[`item.date`]="{ item }"
            >{{ moment(item.date).format("DD MMMM YYYY") }}
          </template>
          <template #[`item.actions`]="{ item }">
            <v-btn icon @click="showCita(item.id)"
              ><v-icon color="accent">mdi-file-pdf-box</v-icon></v-btn
            >
            <v-btn icon
              ><v-icon color="accent" @click="updateCitaModal(item.id)"
                >mdi-pencil</v-icon
              ></v-btn
            >
            <v-btn icon
              ><v-icon color="accent" @click="deleteCita(item.id)"
                >mdi-delete</v-icon
              ></v-btn
            >
          </template>
        </v-data-table>
      </v-card>
    </v-flex>
    <v-dialog v-model="citaModal" max-width="700">
      <v-form @submit.prevent="citaAction()" ref="form">
        <v-card class="pa-5"
          ><h2>Crear cita</h2>
          <v-text-field
            label="Nombre de cliente"
            v-model="nombre"
            :rules="requiredField"
          ></v-text-field>
          <v-text-field
            label="Descripcion"
            v-model="descripcion"
            :rules="requiredField"
          ></v-text-field>
          <v-row justify="center">
            <v-col class="d-flex flex-column" cols="12" md="6">
              <span class="text--lighten-2">Fecha</span>
              <v-date-picker locale="es" v-model="fecha"> </v-date-picker>
            </v-col>
            <v-col class="d-flex flex-column" cols="12" md="6">
              <span class="text--lighten-2">Hora</span>
              <v-time-picker format="ampm" v-model="hora"></v-time-picker>
            </v-col>
          </v-row>
          <v-card-actions>
            <v-btn color="accent" type="submit">GUARDAR</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
    <v-dialog v-model="showCitaDetail" max-width="700">
      <v-card class="pa-10 text-center" v-if="citaData">
        <vue-html2pdf
          :show-layout="true"
          :float-layout="false"
          :enable-download="true"
          :preview-modal="true"
          :paginate-elements-by-height="1000"
          filename="Detalle cita"
          pdf-content-width="100%"
          :pdf-quality="2"
          :manual-pagination="false"
          ref="html2Pdf"
          :html-to-pdf-options="{ margin: 10 }"
        >
          <section slot="pdf-content">
            <h2>Informacion de cita</h2>
            <v-divider class="my-4"></v-divider>
            <v-card-text>
              <b>Nombre: </b> {{ citaData.clientName }}
            </v-card-text>
            <v-card-text>
              <b>Descripcion: </b> {{ citaData.description }}
            </v-card-text>
            <v-card-text>
              <b>Fecha: </b>
              {{ moment(citaData.date).format("DD MMMM YYYY") }}
            </v-card-text>
            <v-card-text> <b>Hora: </b> {{ citaData.time }} </v-card-text>
            <v-card-text>
              <b>Creado: </b>
              {{ moment(citaData.created_at).format("DD MMMM YYYY") }}
            </v-card-text>
            <v-card-text>
              <b>Modificado: </b>
              {{ moment(citaData.created_at).format("DD MMMM YYYY") }}
            </v-card-text>
          </section>
        </vue-html2pdf>
        <v-card-actions class="justify-center">
          <v-btn color="accent" @click="printCitaDetail()">IMPRIMIR</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
import { mapActions, mapState } from "vuex";
import VueHtml2pdf from "vue-html2pdf";

export default {
  components: {
    VueHtml2pdf,
  },
  data: () => ({
    citas: [],
    citaModal: false,
    updatingCita: false,
    citaToUpdateId: null,
    showCitaDetail: false,
    nombre: null,
    fecha: null,
    hora: null,
    descripcion: null,
    citaData: null,
    rowsPerPage: 5,
    currentPage: 1,
    headers: [
      {
        text: "Cliente",
        value: "clientName",
      },
      {
        text: "Fecha",
        value: "date",
      },
      {
        text: "Hora",
        value: "time",
      },
      {
        text: "Creado",
        value: "created_at",
      },
      {
        text: "Acciones",
        value: "actions",
      },
    ],

    requiredField: [
      (v) => (v !== null && v !== "") || "Este campo es requerido",
    ],
  }),
  methods: {
    openNewCitaModal() {
      this.updatingCita = false;
      this.citaModal = true;
      this.nombre = null;
      this.descripcion = null;
      this.fecha = null;
      this.hora = null;
    },
    async updateCitaModal(id) {
      this.citaToUpdateId = id;
      this.citaModal = true;
      this.updatingCita = true;
      this.showLoader();
      try {
        const { data } = await this.http_client(`/api/appointment/${id}`);
        this.citaData = data.data?.appointment;
      } finally {
        this.hideLoader();
      }
      this.nombre = this.citaData.clientName;
      this.descripcion = this.citaData.description;
      this.fecha = this.citaData.date;
      this.hora = this.citaData.time;
    },
    printCitaDetail() {
      this.$refs.html2Pdf.generatePdf();
    },
    async showCita(id) {
      this.showLoader();
      try {
        const { data } = await this.http_client(`/api/appointment/${id}`);
        this.citaData = data.data?.appointment;
      } finally {
        this.hideLoader();
        this.showCitaDetail = true;
      }
    },
    async deleteCita(id) {
      try {
        const response = await this.http_client(
          `/api/appointment/${id}`,
          {},
          "delete"
        );
        if (response.status == 200) {
          this.temporalAlert({
            show: true,
            message: "Registro eliminado correctamente",
            type: "success",
          });
        }
      } finally {
        this.getCitas();
      }
    },
    async citaAction() {
      if (!this.$refs.form.validate()) {
        return;
      }
      if (!this.fecha || !this.hora) {
        this.temporalAlert({
          show: true,
          message: "Fecha y hora son requeridas",
          type: "warning",
        });
      }
      try {
        this.showLoader();
        if (this.updatingCita) {
          const { data } = await this.http_client(
            `/api/appointment/${this.citaToUpdateId}`,
            {
              clientName: this.nombre,
              date: this.fecha,
              description: this.descripcion,
              time: this.hora,
            },
            "put"
          );
          if (data) {
            this.temporalAlert({
              show: true,
              message: "Registro actualizado con exito",
              type: "success",
            });
          }
        } else {
          const { data } = await this.http_client(
            "/api/appointment",
            {
              clientName: this.nombre,
              date: this.fecha,
              description: this.descripcion,
              time: this.hora,
            },
            "post"
          );
          if (data) {
            this.temporalAlert({
              show: true,
              message: "Registro creado con exito",
              type: "success",
            });
          }
        }
        this.citaModal = false;
        await this.getCitas();
      } finally {
        this.hideLoader();
      }
    },
    async getCitas() {
      this.showLoader();
      try {
        const { data } = await this.http_client("api/appointment");
        this.citas = data.data;
      } catch (e) {
      } finally {
        this.hideLoader();
      }
    },
  },
  async created() {
    Promise.all([this.getCitas()]);
  },
};
</script>
