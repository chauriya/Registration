<script>
import PriBaseSelect from "../../base/BaseSelect";

export default {
  name: "pri-select",
  extends: PriBaseSelect,
  computed: {
    extraListeners() {
      if (this.$attrs.change) {
        return {
          change: this.$attrs.change
        };
      }
      return {};
    }
  }
};
</script>
