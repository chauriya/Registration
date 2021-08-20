export default {
  data: () => ({
    registration: {
      pageView: "2FAreg.verify",
      next: {
        event: "event",
        category: "2FAreg.ver",
        action: "click",
        label: "next"
      },
      cancel: {
        event: "event",
        category: "2FAreg.ver",
        action: "click",
        label: "cancel"
      }
    },
    verifyInfo: {
      pageView: "2FAreg.verify",
      next: {
        event: "event",
        category: "2FAreg.ver",
        action: "click",
        label: "next"
      },
      cancel: {
        event: "event",
        category: "2FAreg.ver",
        action: "click",
        label: "cancel"
      }
    },
    communication: {
      pageView: "2FAreg.comms",
      next: {
        event: "event",
        category: "2FAreg.com",
        action: "click",
        label: "next"
      },
      cancel: {
        event: "event",
        category: "2FAreg.com",
        action: "click",
        label: "cancel"
      }
    },
    authentication: {
      pageView: "2FAreg.pro",
      next: {
        event: "event",
        category: "2FAreg.pro",
        action: "click",
        label: "next"
      },
      cancel: {
        event: "event",
        category: "2FAreg.pro",
        action: "click",
        label: "cancel"
      }
    },
    authOtp: {
      pageView: "2FAreg.code",
      next: {
        event: "event",
        category: "2FAreg.code",
        action: "click",
        label: "next"
      },
      cancel: {
        event: "event",
        category: "2FAreg.code",
        action: "click",
        label: "cancel"
      },
      link: {
        event: "event",
        category: "2FAreg.code",
        action: "link",
        label: "resendCode"
      }
    }
  }),
  methods: {
    gtmPageView(page = this.$route.name) {
      /* console.log({
        event: "pageview",
        title: this[page].pageView,
        timestamp: new Date()
      }); */
      window.dataLayer.push({
        event: "pageview",
        title: this[page].pageView,
        timestamp: new Date()
      });
    },
    gtmEvent(action, page = this.$route.name) {
      //console.log({ ...this[page][action], timestamp: new Date() });
      window.dataLayer.push({ ...this[page][action], timestamp: new Date() });
    },
    gtmCustomEvent(property) {
      window.dataLayer.push({
        ...property,
        timestamp: new Date()
      });
    },
    /* ------------------------------ */
    gtmRegType(regtype) {
      window.dataLayer.push({
        repRegType: regtype,
        timestamp: new Date()
      });
    },

    gtmServiceLabel(servicelabel) {
      window.dataLayer.push({
        serviceLevel: servicelabel,
        timestamp: new Date()
      });
    },

    gtmBillOnFile(value) {
      window.dataLayer.push({
        billOnFile: value,
        timestamp: new Date()
      });
    }
  }
};
