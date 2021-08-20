export default {
  getDeviceName() {
    const { userAgent } = window.navigator;
    if (userAgent.indexOf("iPhone") !== -1) {
      return "iPhone";
    }
    if (userAgent.indexOf("iPad") !== -1) {
      return "iPad";
    }
    if (userAgent.indexOf("LG") !== -1) {
      return "LG";
    }
    if (userAgent.indexOf("KFA") !== -1) {
      return "Kindle Fire";
    }
    if (userAgent.indexOf("Nexus") !== -1) {
      return "Nexus";
    }
    if (userAgent.indexOf("Nokia") !== -1) {
      return "Nokia";
    }
    if (userAgent.indexOf("Pixel") !== -1) {
      return "Pixel";
    }
    if (userAgent.indexOf("SM") !== -1 || userAgent.indexOf("GT") !== -1) {
      return "Samsung";
    }
    if (userAgent.indexOf("Android") !== -1) {
      return "Android";
    }
    if (userAgent.indexOf("Edge") !== -1) {
      return "Microsoft Edge";
    }
    if (userAgent.indexOf("Chrome") !== -1) {
      return "Chrome";
    }
    if (userAgent.indexOf("Firefox") !== -1) {
      return "Firefox";
    }
    if (userAgent.indexOf("Safari") !== -1) {
      return "Safari";
    }
    if (userAgent.indexOf("MSIE") !== -1) {
      return "Microsoft Internet Explorer";
    }
    return "Unknown Device";
  }
};
