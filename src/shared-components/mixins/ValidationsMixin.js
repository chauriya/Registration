export const ValidationsMixin = {
  props: ["required"],
  computed: {
    isRequired() {
      return this.required !== undefined && this.required !== false;
    }
  },
  methods: {
    hasValue(v) {
      if (typeof v === "string") {
        return v.trim().length !== 0;
      } else {
        return v !== undefined && v !== null;
      }
    },
    isRequiredValidation(v) {
      const msg = this.requiredText ? this.requiredText : "COMP_REQUIRED";
      return this.hasValue(v) ? true : this.$t(msg);
    }
  }
};
