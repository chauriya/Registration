export default {
  registrationForm: {
    priEmailIdTaken: false
  },
  bannerComponent: {
    show: false,
    type: "warning",
    message: "",
    onClose: () => 1
  },
  dialogComponent: {
    show: false,
    type: "warning",
    headerInfo: "",
    bodyInfo: "",
    bodyDescription: "",
    actionTitle: "",
    onClose: () => 1,
    onCloseDialog: () => 1
  },
  showLoader: false,
  pageDestination: "registration",
  viewRegistration: false,
  authParams: {},
  applicationSource: "",
  deviceDna: "",
  sessionBannerTimer: null,
  sessionDialogTimer: null
};
