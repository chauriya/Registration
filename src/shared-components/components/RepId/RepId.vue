<script>
import PriBaseTextField from "../../base/BaseTextField";

export default {
  name: "Pri-repid",
  extends: PriBaseTextField,
  data: () => ({
    maxLength: "7",
    componentName: "L_PRI_REPID",
    requiredText: "COMP_REPID_REQUIRED",
    invalidTextOne: "COMP_REPID_INVALID"
  }),
  props: {
    allowAlphaNumeric: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    allowCharsFunction(e) {
      if (this.allowAlphaNumeric) {
        return this.onlyAlphaNumeric(e);
      }
      return undefined;
    }
  },
  computed: {
    componentValidations() {
      return [
        str => {
          if (!str) return true;
          if (str.length === 5 || str.length === 7) return true;
          return this.co_invalidTextOne;
        }
      ];
    }
  }
};
</script>
