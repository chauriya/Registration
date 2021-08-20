<template>
  <v-form ref="communicationForm">
    <v-container>
      <v-row>
        <v-col
          cols="12"
          class="text-center title font-sans lightoffblack--text"
          >{{ $t("COM_TITLE") }}</v-col
        >
      </v-row>
      <v-row>
        <v-col>
          <PriSelect
            :items="registrationForm.emailAddresses"
            :label="$t('COM_SELECT_EMAIL')"
            required
            v-model="registrationForm.ClientNameEmail"
            :error="registrationForm.priEmailIdTaken"
            :error-messages="
              registrationForm.priEmailIdTaken ? $t('POL_EMAIL_TAKEN') : ''
            "
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col class="font-weight-bold body-1">
          {{ $t("COM_MESSAGE") }}
        </v-col>
      </v-row>
      <SubmitButtonComponent
        :onSubmitForm="submitForm"
        :isDisabled="!this.validForm || registrationForm.priEmailIdTaken"
      />
    </v-container>
    <FooterComponent />
  </v-form>
</template>
<script>
import { mapActions } from "vuex";
import View from "@/views/view.vue";
import { PriSelect } from "@/shared-components";

export default {
  name: "verifyInfo",
  extends: View,
  components: {
    PriSelect
  },
  async created() {
    await this.getEmailaddresses();
  },
  watch: {
    "registrationForm.ClientNameEmail"() {
      this.emailAvailability();
    }
  },
  methods: {
    ...mapActions("polApi", ["getEmailaddresses", "emailAvailability"]),
    async submitForm(goTo) {
      this.$router.push({ name: goTo });
    }
  }
};
</script>
