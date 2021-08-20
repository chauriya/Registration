<template>
  <div class="sc-base-select">
    <v-select
      :items="co_items"
      :return-object="returnObject"
      v-bind="mixedProps"
      v-if="type === 'select'"
      v-on="mixedListeners"
    >
      <template v-if="!hideLabel" v-slot:label>
        <span class="sc-label sc-wrap-text" v-html="co_componentName" />
        <!-- <span
          class="sc-asterisk"
          :class="{ 'sc-text--error': !co_isDisabled }"
          v-if="isRequired"
        >
          *
        </span> -->
      </template>
      <template v-slot:append>
        <v-icon :disabled="co_isDisabled" @click="emitFocus">
          mdi-menu-down
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
    </v-select>

    <v-radio-group
      :column="$vuetify.breakpoint.mdAndDown"
      @change="onRadioChange"
      class="sc-radio-group"
      v-bind="mixedProps"
      v-if="type === 'radio' && co_items.length >= 1"
      v-on="mixedListeners"
    >
      <div
        :class="{ 'error--text': !valid && shouldShowIcon && !co_isDisabled }"
        class="v-label theme--light d-flex justify-space-between align-start sc-full-width"
        v-if="!noRadioLabel"
      >
        <div class="d-flex">
          <span
            class="sc-label sc-wrap-text"
            :class="{
              'sc-required': isRequired,
              'sc-required-red': isRequired && !co_isDisabled
            }"
            v-html="co_componentName"
          />
        </div>
        <div class="d-flex">
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
        </div>
      </div>
      <v-radio
        :key="index"
        :value="item.value"
        @blur="onRadioBlur"
        color="accent"
        class="mb-2 align-start"
        v-for="(item, index) in co_items"
      >
        <div
          class="lightoffblack--text break-word"
          slot="label"
          v-html="item.text"
        ></div>
      </v-radio>
    </v-radio-group>

    <v-autocomplete
      :items="co_items"
      v-bind="mixedProps"
      v-if="type === 'autocomplete'"
      v-on="mixedListeners"
    >
      <template v-if="!hideLabel" v-slot:label>
        <span class="sc-label sc-wrap-text" v-html="co_componentName" />
        <span
          class="sc-asterisk"
          :class="{ 'sc-text--error': !co_isDisabled }"
          v-if="isRequired"
        >
          *
        </span>
      </template>
      <template v-slot:append>
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
    </v-autocomplete>
    <PriDialog :content="co_info_content" v-model="open" />
  </div>
</template>

<script>
import { ComponentDefaultsMixin, IconMixin, ValidationsMixin } from "../mixins";
import PriDialog from "../components/Dialog/Dialog";

export default {
  name: "pri-base-select",
  components: { PriDialog },
  props: {
    type: {
      default: "select"
    },
    noRadioLabel: {
      type: Boolean,
      default: false
    },
    hideLabel: {
      type: Boolean,
      default: false
    },
    items: {
      type: Array,
      default() {
        return [];
      }
    },
    returnObject: {
      type: Boolean,
      default: false
    },
    showCheckMarkOnValid: {
      type: Boolean,
      default: true
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
  mixins: [ComponentDefaultsMixin, ValidationsMixin, IconMixin],
  data: () => ({
    componentName: "Base Select"
  }),
  computed: {
    co_items() {
      return this.items;
      /* if (!!this.items[0] && !!this.items[0].text) {
        return this.items;
      } else {
        return this.items.map(key => ({ text: key, value: key }));
      } */
    },
    extraProps: () => ({}),
    extraListeners: () => ({}),
    mixedProps() {
      const defaultProps = {
        ref: "iconTarget",
        rules: this.validations,
        value: this.value,
        "item-text": this.$attrs["item-text"],
        "item-value": this.$attrs["item-value"],
        "persistent-hint": this.$attrs["persistent-hint"],
        hint: this.$attrs["hint"],
        disabled: this.co_isDisabled,
        error: this.$attrs.error,
        "error-messages": this.$attrs["error-messages"]
      };
      return {
        ...defaultProps,
        ...this.extraProps
      };
    },
    mixedListeners() {
      const defaultListeners = {
        "paste.prevent": "",
        input: this.onInput
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
  },
  methods: {
    emitFocus() {
      this.$emit("focus");
    },
    onRadioBlur() {
      this.$refs["iconTarget"].hasFocused = true;
    },
    onRadioChange(v) {
      this.$emit("input", v);
    }
  }
};
</script>

<style lang="stylus">
@import '../styles/mixins';

.sc-radio-group
  margin-top: 4px !important;

.sc-radio-group .v-input__control
  width: 100% !important;
  .v-messages
    display: none !important;
  /* .v-input__slot
    margin-bottom: 8px; */

.sc-radio-group .v-input--radio-group__input
  flex-wrap: wrap;
  .v-radio
    width: 100% !important;
</style>
