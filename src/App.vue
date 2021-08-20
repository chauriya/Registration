<template>
  <div>
    <v-app id="inspire">
      <v-app-bar fixed color="primary" dark>
        <v-icon @click="backButton" v-if="showbackbutton"
          >mdi-arrow-left</v-icon
        >
        <v-spacer />
        <v-toolbar-title class="text-h5 font-sans">{{
          $route.meta.title
        }}</v-toolbar-title>
        <v-spacer />
      </v-app-bar>
      <v-container fluid class="py-0">
        <BannerComponent />
        <v-row>
          <v-col cols="12" :class="{ 'pt-16': !bannerShow }" class="px-4 pt-0">
            <LoaderComponent />
            <v-responsive
              :max-width="pageWidth"
              class="mx-auto pt-3"
              v-show="!showLoader"
            >
              <router-view></router-view>
              <DialogComponent />
            </v-responsive>
          </v-col>
        </v-row>
      </v-container>
    </v-app>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from "vuex";
import { Dna } from "@/shared";
import {
  DialogComponent,
  BannerComponent,
  LoaderComponent
} from "@/components";

export default {
  name: "App",
  components: {
    DialogComponent,
    BannerComponent,
    LoaderComponent
  },
  computed: {
    ...mapState("ui", ["showLoader"]),
    ...mapGetters("ui", ["bannerShow"]),
    showbackbutton() {
      return this.$route.meta.showbutton;
    },
    pageWidth() {
      return this.$vuetify.breakpoint.mdAndUp ? 530 : 472;
    }
  },
  async created() {
    const deviceDna = await Dna.getDevice();
    this.setDeviceDna(deviceDna);
  },
  methods: {
    ...mapMutations("ui", ["hideBanner", "setPageDestination", "setDeviceDna"]),
    backButton() {
      /* const prev =
        !this.viewRegistration && this.$route.meta.prev === "pya"
          ? "registration"
          : this.$route.meta.prev; */
      this.setPageDestination(this.$route.meta.prev);
      this.$router.go(-1);
      this.hideBanner();
    }
  }
};
</script>
