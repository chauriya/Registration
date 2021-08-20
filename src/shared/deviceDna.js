export default {
  async getDevice() {
    try {
      let client;
      let dna = null;
      if (window.ca && window.ca.rm) {
        client = new window.ca.rm.Client();
      }
      if (client && typeof client.loadFlash === "function") {
        await client.loadFlash(async () => {
          client.setProperty("format", "json");
          client.setProperty("didname", "RISKFORT_COOKIE");
          await client.processDNA();
          dna = client.getDNA();
        });
      } else {
        dna = null;
      }
      return dna;
    } catch (e) {
      return e;
    }
  }
};
