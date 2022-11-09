import Vue from "vue";
import store from "../store";
import Axios from "axios";
Axios.defaults.baseURL = process.env.VUE_APP_API_URL;
const http_client = async (
  url,
  data = {},
  method = "get",
  headers = {},
  sendToken = true
) => {
  const token = store.state.token
    ? store.state.token
    : localStorage.getItem("token");

  if (token && sendToken) headers.Authorization = "Bearer " + token;

  let config = {
    method,
    url,
    headers,
  };
  if (method === "get") {
    config.params = data;
  } else {
    config.data = data;
  }
  try {
    return await Axios(config);
  } catch (e) {
    console.log(e);
    Vue.prototype.temporalAlert({
      show: true,
      message: e.response.data.message || "Un error ocurrio en el servidor",
      type: "error",
    });
    Vue.prototype.hideLoader();
    return;
  }
};

Vue.prototype.http_client = http_client;

export { http_client };
