<script>
import PriBaseTextField from "../../base/BaseTextField";

export default {
  name: "Pri-otp",
  extends: PriBaseTextField,
  data: () => ({
    maxLength: "6",
    componentName: "L_PRE_OTP",
    requiredText: "COMP_OTP_REQUIRED",
    invalidTextOne: "COMP_MIN_LENGTH"
  }),
  computed: {
    extraProps() {
      return {
        type: "tel",
        class: "center-text",
        autocomplete: "off"
      };
    },
    extraListeners() {
      return {
        input: this.resetAttempt
      };
    },
    componentValidations() {
      return [
        str => {
          if (!str) return true;
          return str.length < 6 ? this.co_invalidTextOne : true;
        }
      ];
    }
  },
  methods: {
    allowCharsFunction(e) {
      return this.onlyNumeric(e);
    },
    resetAttempt(e) {
      this.$emit("attempted", e);
    }
  }
};
</script>
<style lang="stylus">
.center-text
  input, span, .v-messages__wrapper
    text-align: center !important
    max-height: 34px !important
</style>
