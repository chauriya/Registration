<template>
  <v-container>
    <v-row>
      <v-col
        class="lightoffblack--text font-weight-regular title text-center"
        >{{ $t("OTP_ACC_CODE") }}</v-col
      >
    </v-row>
    <v-row>
      <v-col
        class="letter-space charcoleblack--text"
        v-html="$t(contentText.key, maskedValue)"
      />
    </v-row>
    <v-row>
      <v-col class="black400--text font-weight-bold subtitle-2 text-center">{{
        $t("OTP_ENTER_CODE")
      }}</v-col>
    </v-row>
    <v-row class="mx-auto" :class="contentWidth">
      <v-col cols="12" class="px-0">
        <PriOtp
          :placeholder="$t('OTP_CODE')"
          class="text-center"
          @attempted="handleOtpChange($event)"
          required
          :disabled="disableOtp"
          :error-messages="customError"
          autocomplete="off"
        />
      </v-col>
    </v-row>
    <v-row class="mx-auto my-n3" :class="contentWidth">
      <v-col cols="12" class="pa-0 caption resend-text">
        {{ $t("OTP_NOT_RECEVICE_CODE") }}
        <a :class="enablelink ? 'disabled-link' : ''" @click="resendOtp">
          {{ $t("OTP_RESEND_CODE") }}
        </a>
        <br />
        <span v-html="$t('OTP_CODE_TIME')" />
      </v-col>
    </v-row>
    <v-row class="mx-auto pt-4 pb-4" :class="contentWidth">
      <v-col class="pa-0 caption resend-text">
        You can also
        <a :class="enablelink ? 'disabled-link' : ''" @click="tryAnotherMethod"
          >{{ $t("OTP_TRY_ANOTHER_METHOD") }}
        </a>
        <span v-html="$t('OTP_CALL_TECH_SUPPORT')" />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { PriOtp } from "@/shared-components";
import { MaskMixin } from "@/shared-components/mixins";

export default {
  name: "verifyOtpComponent",
  mixins: [MaskMixin],
  components: {
    PriOtp
  },
  props: {
    contentText: {
      required: true,
      type: Object,
      default: () => {
        return {
          key: "",
          option: {}
        };
      }
    },
    handleOtpChange: {
      required: true,
      type: Function,
      default: () => 1
    },
    resendOtp: {
      required: true,
      type: Function,
      default: () => 1
    },
    tryAnotherMethod: {
      required: true,
      type: Function,
      default: () => 1
    },
    disableOtp: {
      type: Boolean,
      default: false
    },
    customError: {
      type: String,
      default: ""
    },
    maskCredential: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    enablelink: true
  }),
  computed: {
    contentWidth() {
      return this.$vuetify.breakpoint.mdAndUp ? "width-md" : "width-sm";
    },
    maskedValue() {
      const value = this.contentText.option.verificationTo.toString();
      if (this.maskCredential) {
        if (value.includes("@")) {
          const emailBreakup = value.split("@");
          const emaiId = `${emailBreakup[0][0]}${emailBreakup[0]
            .slice(1)
            .replace(/[a-zA-Z0-9+.]/g, "*")}`; ///(?<!^).(?!$)/g
          const emailDomain = emailBreakup[1].split(/\.(?=[^.]+$)/);
          return {
            verificationTo: `${emaiId}@${
              emailDomain[0][0]
            }${emailDomain[0].slice(1).replace(/[a-zA-Z0-9+.]/g, "*")}.${
              emailDomain[1]
            }`
          };
        } else {
          let regex = ""; // value.includes('X') ? /x/gi : /[0-9]/g;
          let maskedNumber = "";
          if (value.includes("X")) {
            regex = /x/gi;
            maskedNumber = value.split("-");
          } else {
            regex = /[0-9]/g;
            maskedNumber = this.formatWithMask(value, "(###) ###-####").split(
              "-"
            );
          }
          return {
            verificationTo: `${maskedNumber[0].replace(regex, "*")}-${
              maskedNumber[1]
            }`
          };
        }
      } else {
        return this.contentText.option;
      }
    }
  },
  created() {
    this.togglelink();
  },
  methods: {
    togglelink() {
      this.enablelink = true;
      setTimeout(() => (this.enablelink = false), 25000);
    }
  }
};
</script>
<style lang="stylus" scoped>
.letter-space
  letter-spacing: 0.0125em !important;


.width-md
  max-width: 360px !important;

.width-sm
  max-width: 288px !important;


.disabled-link
  color: var(--v-black200-base) !important;
  cursor: default !important;
  pointer-events: none;


.resend-text
  font-size: 12px;
  color: var(--v-black300-base) !important;
  line-height: 1.33 !important;
</style>
