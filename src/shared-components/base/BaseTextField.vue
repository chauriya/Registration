<template>
  <div class="sc-base-text-field">
    <v-text-field
      @keypress="allowCharsFunction"
      v-bind="mixedProps"
      v-on="mixedListeners"
    >
      <template v-if="!hideLabel" v-slot:label>
        <span class="sc-label sc-wrap-text" v-html="co_componentName" />
        <span
          class="sc-asterisk"
          :class="{ 'sc-text--error': !co_isDisabled }"
          v-if="isRequired"
        >
          <!--  * -->
        </span>
      </template>
      <template v-slot:append>
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
        >
          {{ co_validationIcon }}
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
} from "../mixins";
import PriDialog from "../components/Dialog/Dialog";

export default {
  name: "pri-base-text-field",
  components: { PriDialog },
  mixins: [
    ComponentDefaultsMixin,
    KeypressMixin,
    ValidationsMixin,
    IconMixin,
    MaskMixin
  ],
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
    }
  },
  data: () => ({
    componentName: "Base Text Field"
  }),
  methods: {
    allowCharsFunction() {
      return undefined;
    }
  },
  computed: {
    extraProps: () => ({}),
    extraListeners: () => ({}),
    mixedProps() {
      const defaultProps = {
        maxlength: this.maxLength,
        minlength: this.minLength,
        ref: "iconTarget",
        rules: this.validations,
        value: this.slicedValueByMaxLength,
        disabled: this.co_isDisabled,
        error: this.$attrs.error,
        color: this.valid ? "success" : "",
        "error-messages": this.$attrs["error-messages"],
        "persistent-hint": this.$attrs["persistent-hint"],
        hint: this.$attrs["hint"],
        placeholder: this.$attrs["placeholder"]
      };
      return {
        ...defaultProps,
        ...this.extraProps
      };
    },
    mixedListeners() {
      const defaultListeners = {
        "paste.prevent": "",
        input: this.onInputCapitalizeAndTrimLeft,
        blur: this.trimEdgesAndInnerSpaces
      };
      return {
        ...defaultListeners,
        ...this.extraListeners
      };
    },
    componentValidations() {
      return [];
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
    }
  }
};
</script>

<style lang="stylus" scoped></style>
