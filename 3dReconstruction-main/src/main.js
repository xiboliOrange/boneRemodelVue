
import Vue from "vue";
import VueRouter from "vue-router";
import RouterPrefetch from "vue-router-prefetch";
import DashboardPlugin from "./plugins/dashboard-plugin";
import App from "./App.vue";

// router setup
import router from "./routes";
import i18n from "./i18n";
import "./registerServiceWorker";
import request from "./util/request";
import Moment from "moment";

// plugin setup
Vue.use(DashboardPlugin);
Vue.use(VueRouter);
Vue.use(RouterPrefetch);
Vue.prototype.requset = request;
Vue.prototype.$moment = Moment;
//document.body.classList.toggle('white-content');
/* eslint-disable no-new */
new Vue({
  el: "#app",
  render: (h) => h(App),
  router,
  i18n,
});
