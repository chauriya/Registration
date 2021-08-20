<template>
  <v-form ref="verifyInfoForm">
    <v-container>
      <v-row>
        <v-col cols="12" class="font-weight-black pb-0">{{
          $t("VI_QUE_ONE")
        }}</v-col>
      </v-row>
      <v-row>
        <v-col cols="12" class="pt-1">{{ $t("VI_SUGGESTION_ONE") }}</v-col>
      </v-row>
      <v-row>
        <v-col cols="12" class="font-weight-black pb-0">{{
          $t("VI_REPID")
        }}</v-col>
      </v-row>
      <v-row>
        <v-col cols="12" class="pt-1">{{ registrationForm.userId }}</v-col>
      </v-row>
      <v-row>
        <v-col cols="12" class="font-weight-black pb-0">{{
          $t("VI_NAME")
        }}</v-col>
      </v-row>
      <v-row>
        <v-col cols="12" class="pt-1"
          >{{ registrationForm.firstName }}
          {{ registrationForm.lastName }}</v-col
        >
      </v-row>
      <v-row>
        <v-col cols="12" class="font-weight-black pb-0">{{
          $t("VI_TITLE")
        }}</v-col>
      </v-row>
      <v-row>
        <v-col cols="12" class="pt-1">{{
          registrationForm.displayTitle
        }}</v-col>
      </v-row>
      <v-row>
        <v-col cols="12" class="font-weight-black pb-0">{{
          $t("VI_RVP")
        }}</v-col>
      </v-row>
      <v-row>
        <v-col cols="12" class="pt-1"
          >{{ registrationForm.rvpFirstName }}
          {{ registrationForm.rvpLastName }}</v-col
        >
      </v-row>
      <v-row v-if="registrationForm.doNotDisplayAddress != '1'">
        <v-col cols="12" class="font-weight-black pb-0">{{
          $t("VI_ADDRESS")
        }}</v-col>
      </v-row>
      <v-row v-if="registrationForm.doNotDisplayAddress != '1'">
        <v-col cols="12" class="pt-1"
          >{{ registrationForm.addr1 }}
          <p>
            {{ registrationForm.city }}, {{ registrationForm.state }}
            {{ registrationForm.zip }}
          </p></v-col
        >
      </v-row>
      <SubmitButtonComponent
        :onSubmitForm="submitForm"
        :isDisabled="!validForm"
      />
    </v-container>
    <FooterComponent />
  </v-form>
</template>
<script>
import { mapActions } from "vuex";
import View from "@/views/view.vue";

export default {
  name: "verifyInfo",
  extends: View,
  async created() {
    await this.getSessionInfo();
    await this.verificationUser();
  },
  methods: {
    ...mapActions("polApi", [
      "getSessionInfo",
      "verificationUser",
      "logoutRequest"
    ]),
    ...mapActions("ui", ["startSessionBannerTimer"]),
    async submitForm(goTo) {
      this.logoutRequest();
      this.startSessionBannerTimer();
      this.$router.push({ name: goTo });
    }
  }
};
</script>
