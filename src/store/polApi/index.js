import * as getters from "./getters";
import * as actions from "./actions";

export default {
  namespaced: true,
  getters,
  actions,
  state: {
    hostName: ""
  },
  mutations: {
    setHostName: (state, value) => {
      state.hostName = value;
    }
  }
};
