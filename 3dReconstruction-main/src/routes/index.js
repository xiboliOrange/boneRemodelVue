import Vue from "vue";
import Router from "vue-router";
import Home from "./../pages/home.vue";
import Photo from "./../pages/photo.vue";
import Model from "./../pages/model.vue"
Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      redirect: "/home",
    },
    {
      path: "/home",
      name: "home",
      component: Home,
    },
    {
      path: "/photo",
      name: "photo",
      component: Photo,
    },
    {
      path: "/model",
      name: "model",
      component: Model,
    },
  ],
  linkActiveClass: "active",
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { x: 0, y: 0 };
    }
  },
});
