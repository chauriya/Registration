<template>
  <v-container>
    <v-row>
      <v-col
        cols="12"
        class="title text-center font-weight-regular lightoffblack--text"
        >{{ $t("PYA_HEADER") }}</v-col
      >
    </v-row>
    <v-row>
      <v-col cols="12" class="black400--text">{{ $t("PYA_SUBTITLE") }}</v-col>
    </v-row>
    <v-row>
      <v-col
        cols="12"
        class="font-weight-semibold pb-0 lightoffblack--text break-word"
        v-if="multipleOption && emailList.length > 0"
      >
        Email code to:
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="py-0">
        <PriSelect
          :name="radios"
          required
          v-model="radios"
          :no-radio-label="true"
          type="radio"
          :items="emailList"
          @input="changeOptions('E')"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col
        cols="12"
        class="font-weight-semibold py-0"
        v-if="multipleOption && phoneList.length > 0"
        >Text code to:</v-col
      >
    </v-row>
    <v-row>
      <v-col cols="12" class="py-0">
        <PriSelect
          :name="radios"
          required
          v-model="radios"
          :no-radio-label="true"
          type="radio"
          :items="phoneList"
          @input="changeOptions('P')"
        />
        <p
          v-if="phoneList.length >= 1"
          class="black400--text font-weight-bold pl-8 py-0 body-2"
        >
          {{ $t("PYA_CHARGES") }}
        </p>
      </v-col>
    </v-row>
    <v-row>
      <v-col
        cols="12"
        class="font-weight-semibold lightoffblack--text py-0 body-2 pb-2"
        >{{ $t("PYA_BOTTOM_TEXT") }}</v-col
      >
    </v-row>
    <!-- <v-row class="mx-auto">
      <v-col cols="12" class="pa-0 text-caption font-sans black300--text">
        You can call tech support at
        <a :href="'tel:8887372255'">(888) 737-2255</a> US.
      </v-col>
    </v-row> -->
  </v-container>
</template>
<script>
import { PriSelect } from "@/shared-components";

export default {
  name: "PYAComponent",
  data: () => ({
    multipleOption: false,
    emailList: [],
    phoneList: [],
    radios: null
  }),
  props: {
    communicationOptions: {
      required: true,
      default: () => {
        return {
          emailList: [],
          phoneList: [],
          preferenceInd: ""
        };
      }
    }
  },
  components: {
    PriSelect
  },
  created() {
    this.$root.$on("setPyaData", this.setData);
    this.$emit("changeOptions", { option: this.radios });
  },
  mounted() {
    this.setData(this.communicationOptions);
  },
  methods: {
    setData(options) {
      if (options.preferenceInd === "E" && options.emailList.length > 0) {
        this.radios = options.emailList[0];
      } else if (
        options.preferenceInd === "P" &&
        options.phoneList.length > 0
      ) {
        this.radios = options.phoneList[0];
      }
      this.multipleOption =
        (options.emailList && options.emailList.length > 1) ||
        (options.phoneList && options.phoneList.length > 1);
      this.emailList = this.createListObject("Email", options);
      this.phoneList = this.createListObject("Text", options);
    },
    createListObject(type, options) {
      const items = type === "Email" ? options.emailList : options.phoneList;
      return items
        ? items.map(key => {
            if (!this.multipleOption) {
              return {
                text: `<span class="font-weight-semibold">${type} code to:</span> ${key.replace(
                  /x/gi,
                  "*"
                )}`,
                value: key
              };
            }
            return { text: key.replace(/x/gi, "*"), value: key };
          })
        : [];
    },
    changeOptions(val) {
      this.$emit("changeOptions", { option: this.radios, preferenceInd: val });
    }
  }
};
</script>
