<script>
import PriBaseTextField from "../../base/BaseTextField";

export default {
  name: "pri-email",
  extends: PriBaseTextField,
  data: () => ({
    componentName: "L_PRI_EMAIL",
    invalidTextOne: "COMP_EMAIL_INVALID",
    requiredText: "COMP_EMAIL_REQUIRED",
    invalidTextTwo: "COMP_EMAIL_NON_ClientName",
    invalidTextThree: "COMP_CONFIRM_NOT_MATCH"
  }),
  computed: {
    extraListeners() {
      return {
        blur: this.trimEdgesAndInnerSpacesWithoutCapitalization,
        input: this.onInput
      };
    },
    componentValidations() {
      const emailValidations = [
        str => {
          if (!str) return true;

          // Taken from priEmail.js angular.js directive.
          const regex = /^[_A-Za-z0-9-]+(\.[_A-Za-z0-9-]+)*@([\w-]+\.)+[a-zA-Z]{2,4}$/;
          const check = regex.test(str);
          return check || this.co_invalidTextOne;
        },
        str => {
          if (!str) return true;
          return !str.toLowerCase().includes("@ClientName.com")
            ? true
            : this.co_invalidTextTwo;
        } /* ,
        str => {
          if (!str) return true;
          return (this.verifyemail !== '' && str === this.verifyemail) || this.co_invalidTextThree;
        } */
      ];

      return emailValidations;
    }
  }
};
</script>
