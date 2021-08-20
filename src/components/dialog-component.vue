<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialogComponent.show" persistent max-width="470">
      <div class="dialog error-dialog">
        <v-card>
          <div class="top-bar"></div>
          <v-card-title class="headline pt-2 align-start">
            <div class="mr-4">
              <v-icon size="28" class="pb-1" color="warning">mdi-alert</v-icon>
            </div>
            <div
              class="black400--text font-weight-semibold"
              :class="{ 'title-width': $vuetify.breakpoint.xs }"
            >
              {{ dialogComponent.headerInfo }}
            </div>
            <v-spacer></v-spacer>
            <div class="dialog-close pa-0">
              <v-icon
                size="28"
                color="black"
                class="pt-1 pb-sm-2"
                right
                @click="closeDialog"
                >mdi-close</v-icon
              >
            </div>
          </v-card-title>
          <v-card-text class="dialog-text black400--text">
            <p class="d-info" v-html="dialogComponent.bodyInfo" />
            <p class="d-desc" v-html="dialogComponent.bodyDescription" />
          </v-card-text>
          <v-divider v-if="dialogComponent.actionTitle"></v-divider>
          <v-card-actions v-if="dialogComponent.actionTitle">
            <v-spacer></v-spacer>
            <v-btn
              class="text-capitalize font-weight-semibold text-body-2"
              text
              small
              @click.native="close"
              color="accent"
              >{{ dialogComponent.actionTitle }}</v-btn
            >
          </v-card-actions>
        </v-card>
      </div>
    </v-dialog>
  </v-layout>
</template>
<script>
import { mapState, mapMutations } from "vuex";

export default {
  computed: {
    ...mapState("ui", ["dialogComponent"])
  },
  methods: {
    ...mapMutations("ui", ["hideError"]),
    close() {
      this.hideError();
      this.dialogComponent.onClose();
    },
    closeDialog() {
      this.hideError();
      this.dialogComponent.onCloseDialog();
    }
  }
};
</script>
<style scoped lang="stylus">
.top-bar
  padding: 4px;
  background: var(--v-warning-base);

.title-width
  word-break: break-word;
  line-height: 1.5;
  max-width: calc(100vw - 175px);
</style>
