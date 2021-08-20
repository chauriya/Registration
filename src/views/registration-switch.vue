<template>
  <div>
    <!-- <registration  v-if="viewRegistration"/>
        <registrationFull v-else/> -->
    <verify-info />
  </div>
</template>

<script>
import { mapActions, mapMutations } from "vuex";
// import registration from './registration.vue';
// import registrationFull from './registration-full.vue';
import verifyInfo from "@/views/verify-info.vue";
export default {
  components: {
    // registration,
    // registrationFull,
    verifyInfo
  },
  async created() {
    this.resetSessionTimer();
    this.$route.meta.next = "communication"; // for forced verify-info
    this.setViewRegistration(Object.keys(this.$route.query)[0]);
    this.setApplicationSource(this.$route.query.applicationSource);
  },
  methods: {
    ...mapActions("ui", ["setViewRegistration"]),
    ...mapMutations("ui", ["setApplicationSource", "resetSessionTimer"])
  }
};
</script>
