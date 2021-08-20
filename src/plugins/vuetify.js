import Vue from "vue";
import Vuetify from "vuetify/lib/framework";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    options: {
      customProperties: true
    },
    themes: {
      light: {
        primary: "#063562",
        secondary: "#323E48",
        accent: "#02579E",
        error: "#DD3333",
        info: "#2196F3",
        success: "#0B8D1F",
        warning: "#F39C12",
        black: "#000000",
        black400: "#333333",
        black300: "#666666",
        black200: "#ADADAD",
        white: "#FFFFFF",
        grey: "#CCCCCC",
        grey300: "#EEEEEE",
        anchor: "#02579E",
        btnBlue: "#002c56",
        lightoffblack: "#3a3a3a",
        charcoleblack: "#424242"
      }
    }
  }
});
