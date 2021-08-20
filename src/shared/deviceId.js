export default {
  setDeviceId({ deviceid = "" }) {
    if (!deviceid) {
      return;
    }
    window.localStorage.setItem("deviceid", deviceid);
  },
  getDeviceId() {
    const deviceid = window.localStorage.getItem("deviceid");
    return deviceid === null ? "" : deviceid;
  }
};
