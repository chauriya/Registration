<script>
import { mapMutations, mapState } from "vuex";
import { Gtm } from "@/shared";
import { PriButton } from "@/shared-components";
import { SubmitButtonComponent, FooterComponent } from "@/components";

export default {
  name: "View",
  mixins: [Gtm],
  components: {
    PriButton,
    SubmitButtonComponent,
    FooterComponent
  },
  data: () => ({
    frm: undefined
  }),
  computed: {
    ...mapState("ui", ["registrationForm"]),
    validForm() {
      let isValid = true;
      if (this.frm !== undefined) {
        this.frm.forEach(({ valid }) => {
          if (!valid) isValid = valid;
        });
      }
      return isValid;
    }
  },
  destroyed() {
    this.hideBanner();
  },
  mounted() {
    const frm = Object.keys(this.$refs)[0];
    if (frm) this.frm = this.$refs[frm].inputs;
  },
  methods: {
    ...mapMutations("ui", ["showBanner", "showDialog", "hideBanner"])
  }
};
</script>
