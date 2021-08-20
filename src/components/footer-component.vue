<template>
  <footer class="text-center">
    <v-container class="footer-container">
      <v-row>
        <v-col class="font-avenir-next text-caption black300--text py-0"
          >ClientName</v-col
        >
      </v-row>
      <v-row justify="center">
        <v-col class="py-0">
          <ul>
            <li v-for="link in footerLinks" :key="link.url">
              <a target="_blank" @click="openlink(link.url)">{{
                link.title
              }}</a>
            </li>
          </ul>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col class="font-avenir-next company-name pt-1 black300--text"
          >&copy; {{ getCurrentYear() }} ClientName
          <a @click="openlink('https://www.ClientNameonline.com')"
            >www.ClientNameonline.com</a
          >
        </v-col>
      </v-row>
    </v-container>
  </footer>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "FooterComponent",
  data() {
    return {
      footerLinks: [
        {
          url:
            "http://www.ClientName.com/public/privacy/ClientNameonline_and-ClientName-app_privacy_policy.html",
          title: "Privacy"
        },
        /* {
          url: "http://www.ClientName.com/public/ClientName_disclosures.html",
          title: "Important Disclosures"
        }, */
        {
          url:
            "https://www.ClientNameonline.com/NAPOLWelcome/public/agreements.html",
          title: "Terms"
        }
      ]
    };
  },
  computed: {
    ...mapState(["applicationSource"])
  },
  methods: {
    getCurrentYear() {
      return new Date().getFullYear();
    },
    openlink(link) {
      if (this.applicationSource === "PriApp") {
        var message = {
          name: "PRIAPPOPENWINDOW",
          childData: {
            link
          }
        };
        window.parent.postMessage(message, "*");
      } else {
        window.open(link, "_system");
      }
    }
  }
};
</script>
<style lang="stylus" scoped>
a
  text-decoration: underline;

ul
  list-style: none;
  padding-left: 0px !important;
  li
    display: inline-block;
    padding: 0 5px;
    font-size: 10px;
    a
      color: var(--v-black300-base);
.company-name
  font-size: 10px;

.v-application
  .footer-container
    .font-avenir-next, a
      font-family: 'AvenirNext' !important
</style>
