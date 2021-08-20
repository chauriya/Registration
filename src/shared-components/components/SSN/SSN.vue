<template>
  <div class="sc-ssn">
    <v-text-field
      :append-icon="co_icon"
      :disabled="co_isDisabled"
      :error="$attrs.error"
      :error-messages="$attrs['error-messages']"
      :mask="mask"
      :maxlength="maxLength"
      :rules="validations"
      :type="type"
      :value="displayValue"
      :color="this.valid ? 'success' : ''"
      @blur="isFocused = false"
      @focus="isFocused = true"
      @input="onInput"
      @keypress="onlyNumericPlus($event, '-')"
      oncopy="return false"
      ref="iconTarget"
      :hint="hint"
    >
      <template v-if="!hideLabel" v-slot:label>
        <span class="sc-label sc-wrap-text" v-html="co_componentName" />
        <span
          class="sc-asterisk"
          :class="{ 'sc-text--error': !co_isDisabled }"
          v-if="isRequired"
        >
          <!--   * -->
        </span>
      </template>
      <template v-slot:append>
        <v-icon
          :color="co_actionableIcons"
          :disabled="co_isDisabled"
          @click="toggleVisible"
          style="cursor: pointer"
          >{{ co_icon }}
        </v-icon>
        <v-icon
          :disabled="co_isDisabled"
          @click.stop="onInfoClick"
          color="accent"
          v-if="info"
        >
          info
        </v-icon>
        <v-icon
          :color="co_checkMarkAlertIconsColor"
          :disabled="co_isDisabled"
          v-if="shouldShowIcon"
          >{{ co_validationIcon }}
        </v-icon>
      </template>
    </v-text-field>
    <PriDialog :content="co_info_content" v-model="open" />
  </div>
</template>

<script>
import {
  ComponentDefaultsMixin,
  IconMixin,
  KeypressMixin,
  MaskMixin,
  ValidationsMixin
} from "../../mixins";
import PriDialog from "../../components/Dialog/Dialog";

export default {
  name: "pri-ssn",
  components: { PriDialog },
  props: {
    lastFour: {
      type: String,
      default: ""
    },
    format: {
      type: String,
      required: true,
      validator: str => {
        return str === "SIN" || str === "SSN" || str === "SSNSIN";
      }
    },
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
    inputType: {
      type: String,
      default: "text"
    }
  },
  mixins: [
    ComponentDefaultsMixin,
    IconMixin,
    KeypressMixin,
    MaskMixin,
    ValidationsMixin
  ],
  data: () => ({
    maxLength: 0,
    mask: "",
    type: "text",
    visible: false,
    isFocused: false,
    invalidTextOne: "COMP_SSN_INVALID",
    invalidTextTwo: "COMP_SIN_INVALID",
    requiredText: "COMP_SSN_SIN_REQUIRED",
    spec: null,
    prevValue: null,
    saveValue: null,
    displayValue: ""
  }),
  created() {
    const specs = {
      // Social Insurance Number (Canada)
      SIN: {
        componentLabel: str => {
          const type = this.$t("L_PRI_SIN");
          return !this.displayValue && str && str.length == 4
            ? type + " ***-**" + this.formatWithMask(str, "#-###")
            : type;
        },
        maxLength: 11,
        mask: this.inputType === "text" ? "#########" : false,
        validations: [
          str => {
            if (!str) return true;
            return (
              (/\d{3}-\d{3}-\d{3}/.test(this.saveValue) &&
                this.luhnCheck(this.saveValue)) ||
              this.co_invalidTextTwo
            );
          }
        ]
      },
      // Social Security Number (US)
      SSN: {
        componentLabel: str => {
          const type = this.$t("L_PRI_SSN");
          return !this.displayValue && str && str.length == 4
            ? type + " ***-**-" + str
            : type;
        },
        maxLength: 11,
        mask: this.inputType === "text" ? "#########" : false,
        validations: [
          str => {
            if (!str) return true;
            // Regex https://regex101.com/r/fhZVIR/1
            const regex = /^(?!219-09-9999|078-05-1120|123-45-6789)(?!666|000|9\d{2})\d{3}-(?!00)\d{2}-(?!0{4})\d{4}$/gi;
            return regex.test(this.saveValue) || this.co_invalidTextOne;
          }
        ]
      },
      SSNSIN: {
        componentLabel: str => {
          const type = this.$t("L_PRI_SSNSIN");
          return !this.displayValue && str && str.length == 4
            ? type + " *****" + str
            : type;
        },
        maxLength: 9,
        mask: this.inputType === "text" ? "#########" : false,
        validations: [
          str => {
            if (!str) return true;
            // Regex https://regex101.com/r/fhZVIR/1
            const regex = /^(?!219099999|078051120|123456789)(?!666|000|9\d{2})\d{3}(?!00)\d{2}(?!0{4})\d{4}$/gi;
            return regex.test(this.saveValue) || this.co_invalidTextOne;
          }
        ]
      }
    };
    this.type = this.inputType;
    this.spec = specs[this.format];
    this.maxLength = this.spec.maxLength;
    this.mask = this.spec.mask;

    this.saveValue = "";
    this.prevValue = this.saveValue;
  },
  methods: {
    toggleVisible() {
      this.visible = !this.visible;
      this.displayValue = this.formatDisplay();
      if (this.inputType !== "text") {
        this.type = this.type == this.inputType ? "text" : this.inputType;
        this.$emit("input", this.saveValue);
      } else {
        this.$emit(
          "input",
          this.formatWithMask(this.saveValue, this.spec.mask)
        );
      }
    },
    onInput(val) {
      const value = val;
      const isChanged = value !== this.prevValue;
      const lengthIncreased = value.length > this.prevValue.length;

      if (lengthIncreased) {
        this.saveValue += value.substring(this.prevValue.length);
      } else if (isChanged) {
        this.saveValue = value;
      }

      this.prevValue = value;
      this.displayValue = this.formatDisplay();
      if (this.inputType === "text") {
        this.$emit(
          "input",
          this.formatWithMask(this.saveValue, this.spec.mask)
        );
      } else {
        this.$emit("input", this.saveValue);
      }
    },
    formatDisplay() {
      if (this.inputType === "text") {
        let newValue = this.formatWithMask(this.saveValue, this.spec.mask);
        if (!this.visible) {
          newValue = newValue.replace(/[0-9]/g, "*");
        }
        return newValue;
      } else {
        return this.saveValue;
      }
    }
  },
  computed: {
    co_icon() {
      return this.visible ? "mdi-eye-off" : "mdi-eye";
    },
    co_componentName() {
      return this.spec && this.spec.componentLabel(this.lastFour);
    },
    co_validationIcon() {
      let icon = "";
      if (this.valid) {
        if (this.value || this.lastFour) {
          icon = "mdi-check-circle";
        }
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
      if (!this.spec) {
        return [];
      }
      return this.spec.validations;
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
</style>
