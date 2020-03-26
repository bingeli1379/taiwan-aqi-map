import Vue from "vue";
import axios from "axios";
import VueAxios from "vue-axios";
import { LMap, LTileLayer, LMarker, LPopup, LIcon } from "vue2-leaflet";
import "leaflet/dist/leaflet.css";

import App from "./App.vue";
import "./assets/scss/all.scss";

Vue.use(VueAxios, axios);
Vue.component("l-map", LMap);
Vue.component("l-tile-layer", LTileLayer);
Vue.component("l-marker", LMarker);
Vue.component("l-popup", LPopup);
Vue.component("l-icon", LIcon);

import { Icon } from "leaflet";
delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png")
});

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");
