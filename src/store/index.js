import Vue from "vue";
import Vuex from "vuex";
import ui from "./ui";
import polApi from "./polApi";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: { ui, polApi }
});
