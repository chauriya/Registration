<template>
  <div v-show="showLoader" class="loading">
    <!-- <v-skeleton-loader class="mx-auto" :width="pageWidth" type="image" />
    <v-skeleton-loader class="mx-auto" :width="pageWidth" type="image" />
    <v-skeleton-loader class="mx-auto" :width="pageWidth" type="image" /> -->
    <v-progress-circular indeterminate color="primary"></v-progress-circular>
  </div>
</template>
<script>
import { mapState } from "vuex";

export default {
  name: "ProgressBar",
  computed: {
    ...mapState("ui", ["showLoader"]),
    pageWidth() {
      return this.$vuetify.breakpoint.mdAndUp ? 530 : 472;
    }
  }
};
</script>
<style scoped lang="stylus">
.v-skeleton-loader
  margin: 12px 0 0;

.loading
  position: fixed;
  z-index: 999;
  height: 2em;
  width: 2em;
  overflow: visible;
  margin: auto;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
</style>
