import { Api } from "@/shared";
import i18n from "@/plugins/i18n";

export const getSessionInfo = async ({ commit, dispatch, rootState }) => {
  try {
    commit("ui/toggleLoader", true, { root: true });
    const { data } = await Api.getRequest("pol/session/info", {
      session: rootState.ui.authParams.session
    });
    await commit("ui/setRegistrationForm", data, { root: true });
    commit("ui/toggleLoader", false, { root: true });
    return;
  } catch (e) {
    commit("ui/toggleLoader", false, { root: true });
    dispatch("redirectToLogin");
    return;
  }
};

/*
serverEnviornmentLookup api resp
{"status":{"createdat":"2021-05-27 10:14:46","completedin":"2ms","source":"polC_lpdev46","version":"3275902$b2N0YW5l","hversion":"btaSrvsRel01012017.0.1$","statusmessage":"OK"},"errorInfo":{"errorOccurred":false,"errorMessage":null,"errorId":null,"errorCode":null,"errorTimestamp":"0001-01-01T00:00:00","errorLogErrorId":0,"performanceLogId":0},"additionalSourceMessage":"","sourceCfName":"","protocolStatusCode":200,"priTransId":"a8c562b7-58d1-4ae3-8359-87d6495e4bd1","environmentName":"DEV","gatewayHostName":"https://gtwd.ClientNameonline.com","iisHostName":"http://turboappsweb.dev.pfshq.com","gtmWebKey":"GTM-K4RT2CV","polDomainName":"https://dev.ClientNameonline.com","remoteUser":null,"enableOutOfLoopGatewayHost":"true","outOfLoopGatewayHostName":"https://caapi14d.ClientNameonline.com"}

*/
export const verificationUser = async ({ rootState, getters, commit }) => {
  try {
    commit("ui/toggleLoader", true, { root: true });
    const { data, status } = await Api.getRequest(
      `pol/registration/api/verification/user/${rootState.ui.registrationForm.regType}/${rootState.ui.registrationForm.userId}`,
      getters.defaultHeaders
    );
    if (status !== 204) {
      commit("ui/setRegistrationForm", data.agentData[0], { root: true });
    }
    commit("ui/toggleLoader", false, { root: true });
  } catch {
    commit("ui/toggleLoader", false, { root: true });
    commit(
      "ui/showBanner",
      { type: "warning", message: i18n.t("POL_GENERIC_ERROR") },
      { root: true }
    );
  }
};

export const getEmailaddresses = async ({ rootState, commit, getters }) => {
  try {
    commit("ui/toggleLoader", true, { root: true });
    const { data } = await Api.getRequest(
      "pol/registration/api/emailaddresses",
      {
        verifyFirstName: rootState.ui.registrationForm.firstName,
        verifyLastName: rootState.ui.registrationForm.lastName,
        regType: rootState.ui.registrationForm.regType,
        ...getters.defaultHeaders
      }
    );
    const emailAddresses = [];
    await data.emailAddresses.map(({ email }) => emailAddresses.push(email));
    commit("ui/setRegistrationForm", { emailAddresses }, { root: true });
    commit("ui/toggleLoader", false, { root: true });
  } catch {
    commit("ui/toggleLoader", false, { root: true });
    commit(
      "ui/showBanner",
      { type: "warning", message: i18n.t("POL_GENERIC_ERROR") },
      { root: true }
    );
  }
};

export const emailAvailability = async ({ rootState, commit, getters }) => {
  try {
    commit("ui/toggleLoader", true, { root: true });
    const { data } = await Api.getRequest("pol/registration/api/availability", {
      id: rootState.ui.registrationForm.ClientNameEmail,
      idType: "priemail",
      ...getters.defaultHeaders
    });
    commit("ui/setRegistrationForm", data, { root: true });
    commit("ui/toggleLoader", false, { root: true });
  } catch {
    commit("ui/toggleLoader", false, { root: true });
    commit(
      "ui/showBanner",
      { type: "warning", message: i18n.t("POL_GENERIC_ERROR") },
      { root: true }
    );
  }
};

export const nonClientNameEmailId = async ({ rootState, commit, getters }) => {
  try {
    commit("ui/toggleLoader", true, { root: true });
    const { data } = await Api.getRequest(
      "pol/registration/api/nonClientNameemailid",
      {
        agentId: rootState.ui.registrationForm.userId,
        ...getters.defaultHeaders
      }
    );
    commit("ui/setRegistrationForm", data, { root: true });
    commit("ui/toggleLoader", false, { root: true });
  } catch {
    commit("ui/toggleLoader", false, { root: true });
    commit(
      "ui/showBanner",
      { type: "warning", message: i18n.t("POL_GENERIC_ERROR") },
      { root: true }
    );
  }
};

export const requestOtp = async ({ rootState, commit, getters }, otp) => {
  try {
    commit("ui/toggleLoader", true, { root: true });
    const headers = {
      regType: rootState.ui.registrationForm.regType,
      ...otp,
      ...getters.defaultHeaders
    };
    const body = {
      firstName: rootState.ui.registrationForm.firstName,
      regType: rootState.ui.registrationForm.regType,
      ...otp
    };
    const result = await Api.postRequest(
      "polregistration/users/mfa/otp",
      headers,
      body
    );
    //commit("ui/setRegistrationForm", { preferenceInd: Object.keys(otp)[0], otpOption: otp[Object.keys(otp)[0]] }, { root: true });
    commit("ui/toggleLoader", false, { root: true });
    return result;
  } catch (error) {
    commit("ui/toggleLoader", false, { root: true });
    return Promise.reject(error);
  }
};

export const verificationOtp = async ({ commit, getters }, otp) => {
  try {
    commit("ui/toggleLoader", true, { root: true });
    const verificationResponse = await Api.postRequest(
      "pol/myaccount/users/mfa/verification/otp",
      { otp, ...getters.defaultHeaders }
    );
    commit("ui/toggleLoader", false, { root: true });
    return verificationResponse;
  } catch (error) {
    let errorObject = JSON.parse(JSON.stringify(error.response));
    commit("ui/toggleLoader", false, { root: true });
    return Promise.reject(errorObject);
  }
};
/*
  {ServiceAgreementPath: ''}
*/
/* export const getEligilibityRequest = async ({
  commit,
  getters,
  rootGetters,
}) => {
  try {
    commit("ui/toggleLoader", true, { root: true });
    const eligibilityResponse = await Api.getRequest(
      "pol/myaccount/api/password/reset/eligibility",
      {
        ssn: rootGetters.forgotpassword.ssn,
        dob: rootGetters.forgotpassword.dob,
        ClientNameemail: rootGetters.forgotpassword.ClientNameemail,
        ...getters.defaultHeaders,
      }
    );
    commit("ui/toggleLoader", false, { root: true });
    return eligibilityResponse;
  } catch (error) {
    commit("ui/toggleLoader", false, { root: true });
    return Promise.reject(error);
  }
};

export const getCommunicationOptionsRequest = async ({ commit, getters }) => {
  try {
    commit("ui/toggleLoader", true, { root: true });
    const communicationOptionsResponse = await Api.getRequest(
      "pol/myaccount/api/2fa/communicationoptions",
      getters.defaultHeaders
    );
    commit("ui/toggleLoader", false, { root: true });
    return communicationOptionsResponse;
  } catch (error) {
    commit("ui/toggleLoader", false, { root: true });
    return Promise.reject(error);
  }
};



export const verifyUserEmailRequest = async ({
  commit,
  getters,
  rootGetters,
}) => {
  try {
    commit("ui/toggleLoader", true, { root: true });
    const verifyUserEmailResponse = await Api.getRequest("pol/users/email", {
      email: rootGetters.forgotpassword.emailId,
      ...getters.defaultHeaders,
    });
    commit("ui/toggleLoader", false, { root: true });
    return verifyUserEmailResponse;
  } catch (error) {
    commit("ui/toggleLoader", false, { root: true });
    return Promise.reject(error);
  }
};

export const postPasswordResetRequest = async (
  { commit, getters, rootGetters },
  body
) => {
  try {
    commit("ui/toggleLoader", true, { root: true });
    const postPasswordResetResponse = await Api.postRequest(
      "pol/myaccount/api/password/reset",
      {
        ...getters.defaultHeaders,
        deviceName: getters.deviceName,
        TrustDevice: rootGetters.verifyCode.trustDevice,
      },
      body
    );
    commit("ui/toggleLoader", false, { root: true });
    return postPasswordResetResponse;
  } catch (error) {
    commit("ui/toggleLoader", false, { root: true });
    return Promise.reject(error);
  }
};

export const landHpRequest = async (
  { commit, getters, rootGetters },
  password
) => {
  // try {
    commit("ui/toggleLoader", true, { root: true });
      await Api.postRequest(
      "pol/myaccount/api/land/hp",
      getters.defaultHeaders,
      {
        userName: rootGetters.forgotpassword.userId,
        password,
      }
    );
    // return landHpResponse;
  // } catch (error) {
  //   commit("ui/toggleLoader", false, { root: true });
  //   return Promise.reject(error);
  // }
}; */

export const redirectToLogin = (/* {  rootGetters } */) => {
  // Api.redirectToLogin(rootGetters.getApplicationSource);
  console.log("redirectToLogin called");
};

export const logoutRequest = () => {
  Api.logout();
};
