<template>
  <v-container class="pa-0 pa-sm-2 justify-center d-flex" fill-height fluid>
    <v-flex xs12 sm10>
      <v-card elevation="0" class="pa-5">
        <v-row align="center" class="mb-10">
          <h1>Lista de productos</h1>
          <v-spacer></v-spacer>
          <v-btn color="accent" @click="openNewProductModal()"
            >Crear producto</v-btn
          >
        </v-row>
        <v-alert
          color="primary"
          text
          type="info"
          prominent
          v-if="products.length === 0"
        >
          No hay datos
        </v-alert>
        <v-data-table
          v-else
          :items="products"
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
          <template #[`item.actions`]="{ item }">
            <v-btn icon @click="showProduct(item.id)"
              ><v-icon color="accent">mdi-file-pdf-box</v-icon></v-btn
            >
            <v-btn icon
              ><v-icon color="accent" @click="updateProductModal(item.id)"
                >mdi-pencil</v-icon
              ></v-btn
            >
            <v-btn icon
              ><v-icon color="accent" @click="deleteProduct(item.id)"
                >mdi-delete</v-icon
              ></v-btn
            >
          </template>
        </v-data-table>
      </v-card>
    </v-flex>
    <v-dialog v-model="productModal" max-width="700">
      <v-form @submit.prevent="productAction()" ref="form">
        <v-card class="pa-5"
          ><h2>Crear producto</h2>
          <v-text-field
            label="Nombre de producto"
            v-model="form.nombre"
            :rules="requiredField"
          ></v-text-field>
          <v-text-field
            label="Marca de producto"
            v-model="form.marca"
            :rules="requiredField"
          ></v-text-field>
          <v-text-field
            label="Cantidad"
            v-model.number="form.cantidad"
            :rules="requiredField"
          ></v-text-field>
          <v-text-field
            label="Precio de compra"
            v-model.number="form.pcompra"
            type="number"
            :rules="requiredField"
          ></v-text-field>
          <v-text-field
            label="Precio de venta"
            type="number"
            v-model.number="form.pventa"
            :rules="requiredField"
          ></v-text-field>
          <v-textarea
            no-resize
            v-model="form.description"
            rows="4"
            :rules="requiredField"
          ></v-textarea>
          <v-card-actions>
            <v-btn color="accent" type="submit">GUARDAR</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
    <v-dialog v-model="showProductDetail" max-width="700">
      <v-card class="pa-10 text-center" v-if="productData">
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
            <h2>Informacion de producto</h2>
            <v-divider class="my-4"></v-divider>
            <v-card-text>
              <b>Nombre: </b> {{ productData.nombre }}
            </v-card-text>
            <v-card-text>
              <b>Cantidad: </b> {{ productData.cantidad }}
            </v-card-text>
            <v-card-text>
              <b>Precio de compra: </b> {{ productData.pcompra }}
            </v-card-text>
            <v-card-text>
              <b>Precio de venta: </b> {{ productData.pventa }}
            </v-card-text>
            <v-card-text>
              <b>Descripcion: </b> {{ productData.description }}
            </v-card-text>
            <v-card-text> <b>Marca: </b> {{ productData.marca }} </v-card-text>
            <v-card-text>
              <b>Creado: </b>
              {{ moment(productData.created_at).format("DD MMMM YYYY") }}
            </v-card-text>
            <v-card-text>
              <b>Modificado: </b>
              {{ moment(productData.updated_at).format("DD MMMM YYYY") }}
            </v-card-text>
          </section>
        </vue-html2pdf>
        <v-card-actions class="justify-center">
          <v-btn color="accent" @click="printProduct()">IMPRIMIR</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
import VueHtml2pdf from "vue-html2pdf";

export default {
  components: {
    VueHtml2pdf,
  },
  data: () => ({
    products: [],
    productModal: false,
    updatingProduct: false,
    productToUpdateId: null,
    showProductDetail: false,
    productData: null,
    rowsPerPage: 5,
    currentPage: 1,
    form: {
      nombre: "",
      cantidad: "",
      pventa: "",
      pcompra: "",
      description: "",
      marca: "",
    },
    headers: [
      {
        text: "Nombre",
        value: "nombre",
      },
      {
        text: "Cantidad",
        value: "cantidad",
      },
      {
        text: "Descripcion",
        value: "description",
      },
      {
        text: "Marca",
        value: "marca",
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
    openNewProductModal() {
      this.updatingProduct = false;
      this.productModal = true;
      this.$refs.form.reset();
    },
    async updateProductModal(id) {
      this.productToUpdateId = id;
      this.productModal = true;
      this.updatingProduct = true;
      this.showLoader();
      try {
        const { data } = await this.http_client(`/api/Product/${id}`);
        this.productData = data.data?.product;
      } finally {
        this.hideLoader();
      }
      this.form = this.productData;
    },
    printProduct() {
      this.$refs.html2Pdf.generatePdf();
    },
    async showProduct(id) {
      this.showLoader();
      try {
        const { data } = await this.http_client(`/api/Product/${id}`);
        this.productData = data.data?.product;
      } finally {
        this.hideLoader();
        this.showProductDetail = true;
      }
    },
    async deleteProduct(id) {
      try {
        const response = await this.http_client(
          `/api/Product/${id}`,
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
        this.getProducts();
      }
    },
    async productAction() {
      if (!this.$refs.form.validate()) {
        return;
      }
      try {
        this.showLoader();
        if (this.updatingProduct) {
          const { data } = await this.http_client(
            `/api/Product/${this.productToUpdateId}`,
            this.form,
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
            "/api/Product",
            this.form,
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
        this.productModal = false;
        await this.getProducts();
      } finally {
        this.hideLoader();
      }
    },
    async getProducts() {
      this.showLoader();
      try {
        const { data } = await this.http_client("api/Product");
        this.products = data.data;
      } catch (e) {
      } finally {
        this.hideLoader();
      }
    },
  },
  async created() {
    Promise.all([this.getProducts()]);
  },
};
</script>
