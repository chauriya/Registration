export default {
  data: () => ({
    validationList: [
      {
        isValid: false,
        show: true,
        errorMsg: "Cannot be repeated within eight months",
        wrapperClass: "black300--text",
        iconColor: "black300",
        iconName: "mdi-close-circle",
        // currently this is mapped with eightOrMoreCharacters validator in future it will be replaced
        validator: "eightOrMoreCharacters"
      },
      {
        isValid: false,
        show: true,
        errorMsg: "Use 8 or more characters",
        wrapperClass: "black300--text",
        iconColor: "black300",
        iconName: "mdi-close-circle",
        validator: "eightOrMoreCharacters"
      },
      {
        isValid: false,
        show: true,
        errorMsg: "Use a number (e.g. 1234)",
        wrapperClass: "black300--text",
        iconColor: "black300",
        iconName: "mdi-close-circle",
        validator: "isNumberPresent"
      },
      {
        isValid: false,
        show: true,
        errorMsg: "Use upper and lower case letters (e.g. Aa)",
        wrapperClass: "black300--text",
        iconColor: "black300",
        iconName: "mdi-close-circle",
        validator: "upperAndLoweCaseLetters"
      },
      {
        isValid: false,
        show: true,
        errorMsg: "Password cannot contain Rep ID",
        wrapperClass: "black300--text",
        iconColor: "black300",
        iconName: "mdi-close-circle",
        validator: "canNotContainRepID"
      },
      {
        isValid: false,
        show: false,
        errorMsg: "Your password cannot have spaces",
        wrapperClass: "black300--text",
        iconColor: "black300",
        iconName: "mdi-close-circle",
        validator: "canNotContainSpaces"
      },
      {
        isValid: false,
        show: false,
        errorMsg:
          "Your password cannot contain certain special characters (‘ &lt; &gt; “)",
        wrapperClass: "black300--text",
        iconColor: "black300",
        iconName: "mdi-close-circle",
        validator: "canNotContainSpecialCharacters"
      },
      {
        isValid: false,
        show: false,
        errorMsg:
          "Cannot contain more than two consecutive identical characters.",
        wrapperClass: "black300--text",
        iconColor: "black300",
        iconName: "mdi-close-circle",
        validator: "canNotContainConsecutiveCharacters"
      }
    ]
  }),
  methods: {
    eightOrMoreCharacters(ev) {
      return ev.length >= 8;
    },
    isNumberPresent(ev) {
      return /\d/.test(ev);
    },
    upperAndLoweCaseLetters(ev) {
      let isLowerCase = ev.toUpperCase() != ev;
      let isUpperCase = ev.toLowerCase() != ev;
      return isLowerCase && isUpperCase;
    },
    //TODO: logic for repID
    canNotContainRepID(ev) {
      return !ev.toLowerCase().includes(this.repId.toLowerCase());
    },
    canNotContainSpaces(ev) {
      return !/\s/.test(ev);
    },
    canNotContainSpecialCharacters(ev) {
      return !["‘", "“", ">", "<"].some(substring => ev.includes(substring));
    },
    canNotContainConsecutiveCharacters(ev) {
      return !/^.*(\S)(?: ?\1){2}.*$/.test(ev);
    }
  }
};
