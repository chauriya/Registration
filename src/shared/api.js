import axios from "axios";
import { DeviceId } from "@/shared";
import store from "@/store";

axios.defaults.withCredentials = true;
axios.interceptors.response.use(response => {
  DeviceId.setDeviceId(response.headers);
  return response;
});

axios.interceptors.request.use(async config => {
  const appSource =
    store.state.ui.applicationSource === undefined
      ? "POL"
      : store.state.ui.applicationSource;
  config.headers.applicationSource = `${appSource}-REG`;
  return config;
});

export default {
  async getHostName() {
    try {
      if (store.state.polApi.hostName !== "") {
        return store.state.polApi.hostName;
      }
      let hostName = window.location.hostname;
      const hostEnv = hostName.split(".")[0];
      const response = await axios.get(
        "/polapps/rest/services/s/utility/serverenvironmentlookup"
      );
      hostName =
        hostEnv == "ool"
          ? response.data.outOfLoopGatewayHostName
          : response.data.gatewayHostName;
      // hostName = hostEnv == 'localhost' ? 'https://gtwd.ClientNameonline.com': hostName;
      store.commit("polApi/setHostName", hostName);
      return hostName;
    } catch (error) {
      this.redirectToLogin();
    }
  },
  async getRequest(url, headers, params) {
    console.log(url, { headers, params });
    /* const baseUrl = await this.getHostName();
    return axios.get(`${baseUrl}/${url}`, {
      headers: headers,
      params: params
    }); */
    return new Promise(resolve => {
      setTimeout(() => {
        if (url === "pol/session/info") {
          resolve({ status: 200, data: { userId: "KL513", regType: "rep" } });
        } else if (url === "pol/registration/api/emailaddresses") {
          resolve({
            data: {
              emailAddresses: [
                {
                  __INNER__: "",
                  __LAST__: "",
                  __ODD__: "1",
                  email: "TEST.USER@CALLATLANTA.COM",
                  __COUNTER__: "1",
                  __FIRST__: "1"
                },
                {
                  __INNER__: "1",
                  __LAST__: "",
                  __ODD__: "",
                  email: "TESTUSER@CALLATLANTA.COM",
                  __COUNTER__: "2",
                  __FIRST__: ""
                },
                {
                  __INNER__: "1",
                  __LAST__: "",
                  __ODD__: "1",
                  email: "TUSER@CALLATLANTA.COM",
                  __COUNTER__: "3",
                  __FIRST__: ""
                },
                {
                  __INNER__: "1",
                  __LAST__: "",
                  __ODD__: "",
                  email: "USER.TEST@CALLATLANTA.COM",
                  __COUNTER__: "4",
                  __FIRST__: ""
                },
                {
                  __INNER__: "1",
                  __LAST__: "",
                  __ODD__: "1",
                  email: "TUSER.BVA6405@CALLATLANTA.COM",
                  __COUNTER__: "5",
                  __FIRST__: ""
                },
                {
                  __INNER__: "",
                  __LAST__: "1",
                  __ODD__: "",
                  email: "KHOBBS.BVA6405@CALLATLANTA.COM",
                  __COUNTER__: "6",
                  __FIRST__: ""
                }
              ],
              nonPriEmailAddress: null,
              statusMessage: null
            }
          });
        } else if (url === "pol/registration/api/availability") {
          resolve({
            data: { priEmailIdTaken: false }
          });
        } else if (url === "pol/registration/api/nonClientNameemailid") {
          resolve({
            status: 200,
            data: {
              nonPriEmailAddress: "test.mail@nonpriemail.com"
            }
          });
        } else {
          resolve({
            status: 200,
            data: {
              agentData: [
                {
                  firstName: "Test",
                  cellPhoneCommonAgent: "",
                  isRvp: true,
                  rvpFirstName: "Kevin",
                  rvpLastName: "Hobbs",
                  userId: "BVA6405",
                  hasEmail: "Y",
                  goldenEagle: "Y",
                  state: "FL",
                  personalEmailAddress: "2FAOTPCODESBVA6405@GMAIL.COM",
                  primaryCo: "04",
                  lastName: "User",
                  isBillingInfoAvailable: false,
                  displayTitle: "Office General",
                  mobilePhoneNumber: "6459995466",
                  solutionNumber: "N/A",
                  city: "Lake Worth",
                  addr2: "Ste 302",
                  addr1: "1396 Brayan Lane",
                  zip: "33463"
                }
              ],
              statusMessage: null,
              smSessionCookie: null
            }
          });
        }
      }, 500);
    });
  },
  async postRequest(url, headers, body) {
    /* const baseUrl = await this.getHostName();
    return axios.post(`${baseUrl}/${url}`, body, {
      headers: headers
    }); */
    console.log("postRequest", { url, headers, body });
    return new Promise(resolve => {
      setTimeout(() => {
        if (url === "polregistration/users/mfa/otp") {
          resolve({
            status: 201,
            headers,
            body
          });
          // reject({
          //   error: {
          //     errorCode: 4002
          //   }
          // });
        }
      }, 500);
    });
  },
  redirectToLogin(getApplicationSource) {
    const hostName = window.location.hostname;
    const hostEnv = hostName.split(".")[0];
    // hostEnv = hostEnv == 'www' ? '' : hostEnv + '.'
    if (hostEnv == "localhost") {
      window.open("/registration", "_self");
      return;
    }
    if (getApplicationSource === "PriApp") {
      window.parent.postMessage("PRIAPPLOGIN", "*");
    } else {
      window.open(`https://${hostEnv}.ClientNameonline.com`, "_self");
    }
  },
  logout() {
    const hostName = window.location.hostname;
    const hostEnv = hostName.split(".")[0];
    const baseUrl = "https://" + hostEnv + ".ClientNameonline.com/";
    //axios.get(baseUrl + "registration/logout");
    console.log(baseUrl + "registration/logout");
  }
};
