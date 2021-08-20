<template>
  <v-form ref="verifyotpfrm">
    <VerifyOtpComponent
      :contentText="contentText"
      :handleOtpChange="handleOtpChange"
      :resendOtp="resendOtp"
      :disableOtp="verifyInputIsDisabled"
      :customError="errorMessage"
      :maskCredential="true"
      :tryAnotherMethod="tryAnotherMethod"
    />
    <SubmitButtonComponent
      :onSubmitForm="onNextButtonClick"
      :isDisabled="!validForm"
    />
    <FooterComponent />
  </v-form>
</template>
<script>
import { mapActions, mapMutations } from "vuex";
import View from "@/views/view.vue";
import { VerifyOtpComponent } from "@/components";
import { Gtm } from "@/shared";

export default {
  name: "authOtp",
  extends: View,
  mixins: [Gtm],
  components: {
    VerifyOtpComponent
  },
  data: () => ({
    trustDevice: false,
    otp: "",
    verifyInputIsDisabled: false,
    errorMessage: ""
  }),
  computed: {
    contentText() {
      return this.registrationForm.otpOption.phone
        ? {
            key: "OTP_VERIFICATION_PHONE",
            option: { verificationTo: this.registrationForm.otpOption.phone }
          }
        : {
            key: "OTP_VERIFICATION_EMAIL",
            option: {
              verificationTo: this.registrationForm.otpOption.email.replace(
                /\*/gi,
                "X"
              )
            }
          };
    }
  },
  mounted() {
    this.showOtpBanner();
  },
  methods: {
    ...mapMutations("ui", ["setPageDestination"]),
    ...mapActions("polApi", ["verificationOtp", "requestOtp"]),
    handleOtpChange(value = "") {
      this.otp = value;
    },
    showOtpBanner() {
      const message = this.registrationForm.otpOption.phone
        ? this.$t("OTP_SENT_TEXT")
        : this.$t("OTP_SENT_EMAIL");
      this.showBanner({ type: "success", message });
    },
    tryAnotherMethod() {
      console.log("here");
      this.setPageDestination("authentication");
      this.$router.push({ name: "authentication" });
    },
    async onNextButtonClick() {
      try {
        await this.verificationOtp({
          otp: this.otp,
          ...this.contentText
        });
      } catch (error) {
        const { errorCode, count } = error.data.error;
        this.errorMessage = "";
        if (errorCode == 4002) {
          this.showBanner({ type: "warning", message: "GENERIC_ERROR" });
        } else if (errorCode == 4230) {
          // account Locked
          this.showDialog({
            headerInfo: this.$t("POL_VERIFICATION_FALIED"),
            bodyInfo: this.$t("POL_VERIFICATION_CODE_INCORRECT"),
            bodyDescription: this.$t("POL_RETRY"),
            onCloseDialog: () => this.redirectToLogin()
          });
        } else if (errorCode == 4037) {
          this.showError({
            headerInfo: "Verification Code has expired.",
            bodyInfo: "You may request a new code below.",
            bodyDescription:
              " Please give us at least 25 seconds to send your new code over to you.",
            actionTitle: "Request New Code",
            onClose: this.resendOtp
          });
        } else if (count == 3) {
          this.showError({
            headerInfo: "Verification Failed",
            bodyInfo:
              "The Verification Code entered was incorrect. After three failed attempts at entering the Verification Code, you must request a new code below.",
            bodyDescription:
              "Please give us at least 25 seconds to send your new code.",
            actionTitle: "Request New Code",
            onClose: this.resendOtp,
            onCloseDialog: this.disableVerifyInput
          });
        } else if (count == 1 || count == 2) {
          this.errorMessage = this.$t(
            `VERIFY_CODE_ERROR_MESSAGES.${count - 1}`
          );
        } else {
          this.showBanner({ type: "warning", message: "GENERIC_ERROR" });
        }
      }
    },
    async resendOtp() {
      try {
        this.$refs.verifyotpfrm.$children[0].togglelink();
        this.$refs.verifyotpfrm.reset();
        this.gtmEvent("link");
        const preferenceValue = this.registrationForm.otpOption.phone
          ? { phone: "phone" }
          : { email: "email" };
        await this.requestOtp(preferenceValue);
        this.showOtpBanner();
      } catch ({ error }) {
        if (error.errorCode === 4030) {
          this.showDialog({
            headerInfo: this.$t("POL_VERIFICATION_FALIED"),
            bodyInfo: this.$t("POL_VERIFICATION_CODE_INCORRECT"),
            bodyDescription: this.$t("POL_RETRY"),
            onCloseDialog: () => this.redirectToLogin()
          });
        } else {
          this.showBanner({ type: "error", message: this.$t("GENERIC_ERROR") });
        }
      }
    },
    disableVerifyInput() {
      this.$refs.verifyotpfrm.reset();
      this.verifyInputIsDisabled = true;
    }
  }
};
</script>
