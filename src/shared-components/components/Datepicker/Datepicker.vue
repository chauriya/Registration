<template>
  <div class="sc-datepicker">
    <v-text-field
      :disabled="co_isDisabled"
      :error="$attrs.error"
      :error-messages="$attrs['error-messages']"
      :max-length="maxLength"
      :maxlength="maxLength"
      :rules="validations"
      :value="formattedValue"
      @blur="isFocused = false"
      @focus="isFocused = true"
      :color="this.valid ? 'success' : ''"
      @input="onInput"
      @keypress="onlyNumericPlus($event, '/')"
      @paste.prevent
      ref="iconTarget"
    >
      <template v-if="!hideLabel" v-slot:label>
        <span class="sc-label sc-wrap-text" v-html="co_label" />
        <span
          class="sc-asterisk"
          :class="{ 'sc-text--error': !co_isDisabled }"
          v-if="isRequired"
        >
          <!-- * -->
        </span>
      </template>
      <template v-slot:append>
        <v-icon
          :disabled="co_isDisabled"
          @click="openDialog"
          v-if="showCalendar"
        >
          {{ "mdi-calendar" }}
        </v-icon>
        <v-icon
          :disabled="co_isDisabled"
          @click.stop="onInfoClick"
          color="accent"
          v-if="info"
        >
          mdi-information
        </v-icon>
        <v-icon
          :color="co_checkMarkAlertIconsColor"
          :disabled="co_isDisabled"
          v-if="shouldShowIcon"
        >
          {{ co_validationIcon }}
        </v-icon>
      </template>
    </v-text-field>
    <v-dialog ref="dialog" v-model="dialog" width="290px">
      <v-date-picker
        :disabled="co_isDisabled"
        :max="co_max"
        :min="co_min"
        :type="this.format === 'month' ? 'month' : 'date'"
        :value="co_value"
        @input="onDatepickerInput"
        ref="picker"
      />
    </v-dialog>
    <PriDialog :content="co_info_content" v-model="open" />
  </div>
</template>

<script>
import { compareAsc, isEqual, startOfDay, subYears, isFuture } from "date-fns";
import {
  ComponentDefaultsMixin,
  DateHelpersMixin,
  IconMixin,
  KeypressMixin,
  MaskMixin,
  ValidationsMixin
} from "../../mixins";
import PriDialog from "../../components/Dialog/Dialog";
import _ from "lodash";

export default {
  name: "pri-datepicker",
  components: { PriDialog },
  data: () => ({
    dialog: false,
    maxLength: 10,
    isFocused: false,
    invalidTextOne: "COMP_INVALID_DATE",
    invalidTextTwo: "COMP_INVALID_DATE_RANGE",
    ineligibleText: "COMP_INVALID_DOB_RANGE",
    invalidTextThree: "COMP_INVALID_DOB",
    requiredText: "COMP_DOB_REQUIRED",
    tValue: "",
    formattedValue: ""
  }),
  mixins: [
    ComponentDefaultsMixin,
    DateHelpersMixin,
    IconMixin,
    KeypressMixin,
    MaskMixin,
    ValidationsMixin
  ],
  props: {
    value: String,
    label: String,
    max: String,
    min: String,
    maxAge: {
      type: String,
      default: "-1"
    },
    minAge: {
      type: String,
      default: "-1"
    },
    outOfRangeMessage: {
      type: String,
      default: undefined
    },
    format: {
      type: String,
      default: "date"
    },
    skipFormatting: {
      type: Boolean,
      default: false
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
    showCalendar: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    co_label() {
      if (this.label) return this.label;
      let toTranslate = "";
      if (this.format === "dob") {
        toTranslate = "COMP_DATE_OF_BIRTH";
      } else {
        toTranslate = "COMP_DATEPICKER";
      }
      return this.$t(toTranslate);
    },
    co_value() {
      if (this.isMonthSlashYear(this.formattedValue)) {
        return this.formattedValue
          .split("/")
          .reverse()
          .join("-");
      }
      return this.isValidDate(this.formattedValue)
        ? this.format === "month"
          ? this.formatYYYYMM(this.formattedValue)
          : this.formatYYYYMMDD(this.formattedValue)
        : null;
    },
    co_max() {
      if (this.format === "dob") {
        return this.formatYYYYMMDD(this.getMaxDOB(new Date()));
      }
      return this.max ? this.formatYYYYMMDD(this.max) : null;
    },
    co_min() {
      if (this.format === "dob") {
        return this.formatYYYYMMDD(this.getMinDOB(new Date()));
      }
      return this.min ? this.formatYYYYMMDD(this.min) : null;
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
      let datepickerValidation = [
        str => {
          if (!str) return true;
          let valid = this.isValidDate(str);
          return (
            valid ||
            (this.format === "dob"
              ? this.co_invalidTextThree
              : this.co_invalidTextOne)
          );
        },
        str => {
          if (!str) return true;
          if (this.format === "dob") {
            return (
              this.isDOBInRange(str) ||
              this.outOfRangeMessage ||
              this.co_ineligibleText
            );
          } else if (this.max || this.min) {
            return this.isDateInRange(str) || this.co_invalidTextTwo;
          } else {
            return true;
          }
        },
        str => {
          if (!str) return true;
          if (!this.dobRange) return true;
          let valid = this.isValidDate(str);
          return valid && this.isWithinRange(str)
            ? true
            : this.co_ineligibleText;
        },
        str => {
          if (this.format !== "dob") return true;
          return !isFuture(new Date(str)) || this.co_ineligibleText;
        }
      ];
      return this.isRequired
        ? [this.isRequiredValidation, ...datepickerValidation]
        : datepickerValidation;
    }
  },
  watch: {
    value() {
      if (!this.skipFormatting) this.updateValueWithFormatting();
    }
  },
  created() {
    // Need to do this so the pages can grab the current value and update the model
    if (!this.skipFormatting) this.updateValueWithFormatting();
  },
  methods: {
    updateValueWithFormatting() {
      if (this.value) {
        this.formattedValue = _.clone(this.value);
        if (this.value.indexOf("T") > -1) {
          this.tValue = this.value.substring(
            this.value.indexOf("T"),
            this.value.length
          );
          this.formattedValue = this.formattedValue.substring(
            0,
            this.value.indexOf("T")
          );
        }
        if (this.format === "month") {
          this.formattedValue = this.formatMMYYYY(this.formattedValue);
        } else {
          this.formattedValue = this.formatMMDDYYYY(this.formattedValue);
        }
      }
    },
    openDialog() {
      if (this.format === "dob" && !this.formattedValue)
        setTimeout(() => (this.$refs["picker"].activePicker = "YEAR"));
      this.dialog = true;
    },
    onInput(val) {
      // have to check lengths to avoid an issue with deleting inline
      let validLength = false;
      let maskedValue = val;
      if (this.format === "month") {
        maskedValue = this.formatWithMask(val, "##/####");
        let [month, year] = maskedValue.split("/");
        validLength = month && month.length === 2 && year && year.length === 4;
      } else {
        maskedValue = this.formatWithMask(val, "##/##/####");
        let [month, day, year] = maskedValue.split("/");
        validLength =
          month &&
          month.length === 2 &&
          day &&
          day.length === 2 &&
          year &&
          year.length === 4;
      }
      if (validLength) {
        if (this.format === "month") {
          this.formattedValue = maskedValue;
          if (this.isValidDate(this.formattedValue)) {
            this.$emit(
              "dateChanged",
              this.formatYYYYMM(this.formattedValue) + this.tValue
            );
          }
        } else {
          this.formattedValue = maskedValue;
          if (this.isValidDate(this.formattedValue)) {
            this.$emit(
              "dateChanged",
              this.formatYYYYMMDD(this.formattedValue) + this.tValue
            );
          }
        }
        this.$emit("input", this.formattedValue);
      } else {
        if (maskedValue.charAt(maskedValue.length - 1) === "/") {
          this.formattedValue = maskedValue;
          this.$emit("input", this.formattedValue);
        } else {
          this.formattedValue = maskedValue;
          this.$emit("input", val);
        }
      }
    },
    onDatepickerInput(val) {
      this.dialog = false;
      if (this.isYearDashMonth(val)) {
        this.formattedValue = this.formatMMYYYY(val);
        this.$emit(
          "dateChanged",
          this.formatYYYYMM(this.formattedValue) + this.tValue
        );
      } else {
        this.formattedValue = this.formatMMDDYYYY(val);
        this.$emit(
          "dateChanged",
          this.formatYYYYMMDD(this.formattedValue) + this.tValue
        );
      }
      this.$emit("input", this.formattedValue);
    },
    isDOBInRange(str) {
      if (!this.isValidDate(this.formattedValue)) return false;

      const today = new Date();
      const dateToCheck = new Date(str);
      const dateBetween = [
        this.getMinDOB(today),
        this.getMaxDOB(today),
        dateToCheck
      ].sort(compareAsc)[1];

      return isEqual(dateToCheck, dateBetween);
    },
    isDateInRange(str) {
      if (!this.isValidDate(this.formattedValue)) return false;

      const dateToCheck = new Date(str);
      const dateBetween = [
        this.min ? new Date(this.min + "T00:00:00") : new Date("0001-01-01"),
        this.max ? new Date(this.max + "T00:00:00") : new Date("3001-01-01"),
        dateToCheck
      ].sort(compareAsc)[1];

      return isEqual(dateToCheck, dateBetween);
    },
    getMaxAge() {
      return this.maxAge >= 0 ? this.maxAge : 100;
    },
    getMinAge() {
      return this.minAge >= 0 ? this.minAge : 0;
    },
    getMinDOB(fromDate) {
      return startOfDay(subYears(fromDate, this.getMaxAge()));
    },
    getMaxDOB(fromDate) {
      return startOfDay(subYears(fromDate, this.getMinAge()));
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
