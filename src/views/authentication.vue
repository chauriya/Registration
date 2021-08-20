<template>
  <v-form ref="authenticationform">
    <v-container>
      <protect-your-account-component
        :communicationOptions="communicationOptions"
        @changeOptions="optionChange"
      />
      <SubmitButtonComponent
        :onSubmitForm="onNextClick"
        :isDisabled="!validForm"
      />
    </v-container>
    <FooterComponent />
  </v-form>
</template>
<script>
import { mapActions, mapMutations } from "vuex";
import View from "@/views/view.vue";
import { ProtectYourAccountComponent } from "@/components";
import { MaskMixin } from "@/shared-components/mixins";
import { Gtm } from "@/shared";

export default {
  name: "pya",
  extends: View,
  mixins: [MaskMixin, Gtm],
  components: {
    ProtectYourAccountComponent
  },
  data: () => ({
    communicationOptions: {
      preferenceInd: "",
      phoneList: [],
      emailList: []
    },
    radioOption: ""
  }),
  async created() {
    await this.setCommunicationOptions();
  },
  methods: {
    ...mapActions("polApi", [
      "nonClientNameEmailId",
      "requestOtp",
      "redirectToLogin"
    ]),
    ...mapMutations("ui", ["setRegistrationForm"]),
    async setCommunicationOptions() {
      try {
        if (this.registrationForm.mobilePhoneNumber) {
          this.communicationOptions.phoneList.push(
            this.formatWithMask(
              this.registrationForm.mobilePhoneNumber,
              "(###) ###-####"
            )
          );
        }
        if (!this.registrationForm.personalEmailAddress) {
          await this.nonClientNameEmailId();
          if (this.registrationForm.nonPriEmailAddress) {
            this.communicationOptions.emailList.push(
              this.registrationForm.nonPriEmailAddress
            );
          }
        } else {
          this.communicationOptions.emailList.push(
            this.registrationForm.personalEmailAddress
          );
        }
        this.$root.$emit("setPyaData", this.communicationOptions);
        if (
          this.communicationOptions.emailList.length === 0 &&
          this.communicationOptions.phoneList.length === 0
        ) {
          this.showDialog({
            headerInfo: this.$t("POL_SORRY_MESSAGE"),
            bodyDescription: this.$t("GENERIC_ERROR"),
            onCloseDialog: () => this.redirectToLogin()
          });
        }
      } catch (error) {
        this.showBanner({ type: "error", message: this.$("GENERIC_ERROR") });
      }
    },
    optionChange({ option, preferenceInd }) {
      this.radioOption = option;
      this.communicationOptions.preferenceInd = preferenceInd;
    },
    async onNextClick(goTo) {
      let otp = {};
      if (this.communicationOptions.preferenceInd === "E") {
        otp = { email: "email" };
        this.gtmCustomEvent({ "2FAchannel": "email" });
      } else {
        otp = { phone: "phone" };
        this.gtmCustomEvent({ "2FAchannel": "phone" });
      }
      try {
        const result = await this.requestOtp(otp);
        this.setRegistrationForm({
          otpOption: { [Object.keys(otp)[0]]: this.radioOption }
        });
        if (result.status === 201) {
          this.$router.push({ name: goTo });
        }
      } catch ({ error }) {
        if (error.errorCode == 4002) {
          this.showDialog({
            headerInfo: this.$t("POL_VERIFICATION_FALIED"),
            bodyInfo: this.$t("AUTH_ACCOUNT_LOCKED"),
            bodyDescription: this.$t("POL_RETRY"),
            actionTitle: this.$t("POL_OK"),
            onClose: () => this.redirectToLogin(),
            onCloseDialog: () => this.redirectToLogin()
          });
        } else {
          this.showBanner({ type: "error", message: this.$t("GENERIC_ERROR") });
        }
      }
    }
  }
};
</script>
