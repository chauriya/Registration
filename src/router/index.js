import Vue from "vue";
import VueRouter from "vue-router";
import store from "@/store";

Vue.use(VueRouter);

const routes = [
  {
    path: "/registration",
    meta: {
      title: "Registration",
      showbutton: false,
      prev: null,
      next: null
    },
    name: "registration",
    component: () => import("@/views/registration-switch.vue")
  },
  {
    path: "/verify-info",
    meta: {
      title: "Registration",
      showbutton: false,
      prev: "registration",
      next: "communication"
    },
    name: "verifyInfo",
    component: () => import("@/views/verify-info.vue")
  },
  {
    path: "/communication",
    meta: {
      title: "Contact Information",
      showbutton: false,
      prev: "registration",
      next: "authentication"
    },
    name: "communication",
    component: () => import("@/views/communication.vue")
  },
  {
    path: "/authentication",
    meta: {
      title: "Protect Your Account",
      showbutton: false,
      prev: "communication",
      next: "authOtp"
    },
    name: "authentication",
    component: () => import("@/views/authentication.vue")
  },
  {
    path: "/auth-otp",
    meta: {
      title: "Protect Your Account",
      showbutton: false,
      prev: "authentication",
      next: "termsAndCondition"
    },
    name: "authOtp",
    component: () => import("@/views/auth-otp.vue")
  },
  {
    path: "/terms-and-condition",
    meta: {
      title: "Subscription Agreement",
      prev: "authOtp",
      next: "passwordSetup"
    },
    name: "termsAndCondition",
    component: () => import("@/views/terms-condition.vue")
  },
  {
    path: "/password-setup",
    meta: {
      title: "Protect Your Account",
      showbutton: false,
      prev: "termsAndCondition",
      next: null
    },
    name: "passwordSetup",
    component: () => import("@/views/password-setup.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  routes,
  scrollBehavior() {
    return new Promise(resolve => {
      resolve({ x: 0, y: 0 });
    });
  }
});

router.beforeEach((to, from, next) => {
  if (to.name != "registration" && from.name == null) {
    next({ path: "/registration" });
  } else if (store.getters["ui/getPageDestination"] !== to.name) {
    store.dispatch("polApi/redirectToLogin");
  } else {
    next();
  }
});

export default router;
