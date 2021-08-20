<template>
  <div class="sc-password">
    <v-text-field
      :append-icon="co_icon"
      :disabled="co_isDisabled"
      :error="!allValidationPassed && isActivated"
      :error-messages="$attrs['error-messages']"
      :success="allValidationPassed && isActivated"
      :success-messages="$attrs['success-messages']"
      :minlength="minLength"
      :rules="validations"
      :type="type"
      @blur="onBlur"
      @focus="isFocused = true"
      @input="onInput"
      :value="displayValue"
      @paste.prevent
      oncopy="return false"
      ref="iconTarget"
      :hint="$attrs['hint']"
      :color="labelClass"
    >
      <template v-if="!hideLabel" v-slot:label :class="labelColor">
        <span class="sc-label sc-wrap-text" v-html="co_componentName" />
        <!-- <span class="sc-asterisk" :class="{ 'sc-text--error': !co_isDisabled }" v-if="isRequired">
            *
        </span>-->
      </template>
      <template v-slot:append>
        <v-icon
          :color="co_actionableIcons"
          :disabled="co_isDisabled"
          @click="toggleVisible"
          style="cursor: pointer"
          >{{ co_icon }}</v-icon
        >
        <v-icon
          :disabled="co_isDisabled"
          @click.stop="onInfoClick"
          color="accent"
          v-if="info"
          >info</v-icon
        >
        <v-icon
          :color="co_checkMarkAlertIconsColor"
          :disabled="co_isDisabled"
          v-if="shouldShowIcon || passwordValidated"
          >{{ co_validationIcon }}</v-icon
        >
      </template>
    </v-text-field>
    <div v-if="!isConfirmPassword">
      <div class="mt-n6">
        <span class="text-caption" :class="hintClass">{{
          $t("COMP_PASSWORD_HINT_MSG")
        }}</span>
      </div>
      <div
        class="font-sans text-caption validation-set mt-2 pa-2"
        v-if="isFocused"
      >
        <div
          :class="message.wrapperClass"
          class="text-caption"
          v-for="(message, index) in validationList"
          :key="index"
        >
          <span v-if="message.show" class="validation-message">
            <v-icon size="12" :color="message.iconColor">{{
              message.iconName
            }}</v-icon>
            {{ message.errorMsg }}
          </span>
        </div>
        <div class="success--text" v-if="allValidationPassed">
          <v-icon size="12" color="success">mdi-check-circle</v-icon>STRONG
          password created
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  ComponentDefaultsMixin,
  IconMixin,
  KeypressMixin,
  ValidationsMixin
} from "../../mixins";
import PasswordMixin from "./PasswordMixin";
export default {
  name: "pri-password",
  props: {
    hideLabel: {
      type: Boolean,
      default: false
    },
    appendValidations: {
      type: Array,
      default: () => []
    },
    prependValidations: {
      type: Array,
      default: () => []
    },
    hint: {
      type: String,
      default: undefined
    },
    isConfirmPassword: {
      type: Boolean,
      default: false
    },
    passwordStr: String,
    repId: {
      type: String,
      default: ""
    }
  },
  mixins: [
    ComponentDefaultsMixin,
    IconMixin,
    KeypressMixin,
    ValidationsMixin,
    PasswordMixin
  ],
  data: () => ({
    minLength: 8,
    displayValue: "",
    type: "password",
    visible: false,
    isFocused: false,
    invalidTextOne: "COMP_CONFIRM_PASSWORD_INVALID",
    invalidTextTwo: "COMP_CONFIRM_PASSWORD_REQUIRED",
    allValidationPassed: false,
    isActivated: false,
    hintClass: "",
    labelColor: "black300--text",
    labelClass: "",
    passwordValidated: false
  }),
  created() {
    this.$root.$on("setAsValidationPassed", this.setAsValidationPassed);
  },
  methods: {
    setAsValidationPassed(flag) {
      this.passwordValidated = flag;
      if (this.isConfirmPassword) {
        setTimeout(() => {
          this.allValidationPassed = flag;
        }, 250);
      } else if (flag === true) {
        this.hintClass = "success--text";
      }
    },
    onBlur() {
      this.isActivated = true;
      if (!this.allValidationPassed) {
        this.labelClass = "error";
      }
      this.validationList.forEach(currentValidation => {
        currentValidation.wrapperClass = "error--text";
        currentValidation.iconColor = "error";
      });
    },
    toggleVisible() {
      if (this.type === "password") {
        this.visible = true;
        this.type = "text";
      } else {
        this.visible = false;
        this.type = "password";
      }
    },
    onInput(val) {
      this.displayValue = val;
      this.isActivated = true;
      if (!this.isConfirmPassword) {
        this.validationList.forEach(element => {
          const validaorKey = this[element.validator];
          if (validaorKey(val)) {
            element.iconName = "mdi-check-circle";
            element.wrapperClass = "success--text";
            element.iconColor = "success";
            element.isValid = true;
            setTimeout(() => {
              element.show = false;
            }, 250);
          } else {
            element.iconName = "mdi-close-circle";
            element.wrapperClass = "error--text";
            element.iconColor = "error";
            element.isValid = false;
            setTimeout(() => {
              element.show = true;
            }, 250);
          }
        });
        this.checkAllValidationsPassed(val);
      } else {
        this.$emit("passwordChanged", { value: val, valid: undefined });
      }
    },
    checkAllValidationsPassed(val) {
      setTimeout(() => {
        this.allValidationPassed = !this.validationList.some(e => !e.isValid);
        this.$emit("passwordChanged", {
          value: val,
          valid: this.allValidationPassed
        });
      }, 250);
    },
    setHintColorClass(isValid = false) {
      this.hintClass = isValid ? "success--text" : "error--text";
      this.labelColor = isValid ? "success--text" : "error--text";
      this.labelClass = isValid ? "success" : "error";
    }
  },
  computed: {
    co_checkMarkAlertIconsColor() {
      if (this.co_isDisabled) {
        return "";
      } else if (!this.allValidationPassed) {
        this.setHintColorClass(false);
        return "error";
      } else {
        this.setHintColorClass(true);
        return "grey";
      }
    },
    co_icon() {
      return this.visible ? "mdi-eye-off" : "mdi-eye";
    },
    co_validationIcon() {
      let icon = "";
      if (this.allValidationPassed) {
        icon = "mdi-lock";
      } else {
        icon = "mdi-alert-circle";
      }
      return icon;
    },
    validations() {
      const constantValidations = [
        ...this.prependValidations,
        ...this.componentValidations,
        ...this.appendValidations
      ];
      return this.isRequired
        ? [this.isRequiredValidation, ...constantValidations]
        : [...constantValidations];
    },
    componentValidations() {
      if (!this.isConfirmPassword) return [];
      return [
        str => {
          if (this.passwordStr == undefined) return true;
          if (str == "") return true;
          return str != this.passwordStr ? this.co_invalidTextOne : true;
        },
        str => {
          if (this.passwordStr == undefined) return true;
          return str == "" ? this.co_invalidTextTwo : true;
        }
      ];
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '../../styles/mixins';

.pri-required:after
  required;

.pri-required.pri-required-red:after
  requiredRed;

.validation-set
  border: 1px solid #d8d8d8;
  border-radius: 2px;

.validation-set:empty
   display: none !important;

.fade-enter-active, .fade-leave-active
  transition: opacity 3s;

.fade-enter, .fade-leave-to
  opacity: 0;

.validation-message
  font-size: 12px !important;
</style>
