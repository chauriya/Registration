export const showBanner = (
  state,
  { type = "", message = "", onClose = () => 1 }
) => {
  state.bannerComponent.type = type;
  state.bannerComponent.message = message;
  state.bannerComponent.onClose = onClose;
  state.bannerComponent.show = type !== "" ? true : false;
  setTimeout(() => {
    state.bannerComponent.show = false;
  }, 10000);
};

export const hideBanner = state => {
  state.bannerComponent.show = false;
};

export const showDialog = (
  state,
  {
    headerInfo = "",
    bodyInfo = "",
    bodyDescription = "",
    actionTitle = "",
    onClose = () => 1,
    onCloseDialog = () => 1
  }
) => {
  state.dialogComponent.show = true;
  state.dialogComponent.headerInfo = headerInfo;
  state.dialogComponent.bodyInfo = bodyInfo;
  state.dialogComponent.bodyDescription = bodyDescription;
  state.dialogComponent.actionTitle = actionTitle;
  state.dialogComponent.onClose = onClose;
  state.dialogComponent.onCloseDialog = onCloseDialog;
};

export const hideError = state => {
  state.dialogComponent.show = false;
};

export const toggleLoader = (state, value) => {
  state.showLoader = value;
};

export const setPageDestination = (state, value) => {
  state.pageDestination = value;
};

export const setViewRegistration = (state, value) => {
  state.viewRegistration = value;
};

export const setAuthParams = (state, value) => {
  state.authParams = { ...state.authParams, ...value };
};

export const setDeviceDna = async (state, value) => {
  state.deviceDna = value;
};

export const setApplicationSource = (state, value) => {
  state.applicationSource = value;
};

export const setRegistrationForm = (state, value) => {
  state.registrationForm = { ...state.registrationForm, ...value };
};

export const setSessionBannerTimer = (state, value) => {
  state.setSessionBannerTimer = value;
};

export const setSessionDialogTimer = (state, value) => {
  state.sessionDialogTimer = value;
};

export const resetSessionTimer = state => {
  clearTimeout(state.setSessionBannerTimer);
  clearTimeout(state.sessionDialogTimer);
};
