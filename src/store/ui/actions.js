import i18n from "@/plugins/i18n";

export const setViewRegistration = async ({ commit }, value) => {
  commit("setViewRegistration", true); // Forcefully making beta registration available
  commit("setAuthParams", { session: value });
};

export const startSessionBannerTimer = ({ commit, dispatch }) => {
  const sessionBannerTimer = setTimeout(() => {
    commit("showBanner", {
      type: "warning",
      message: i18n.t("POL_SESSION_BANNER")
    });
    dispatch("startSessionDialogTimer");
  }, 25 * 60 * 1000);
  commit("setSessionBannerTimer", sessionBannerTimer);
};

export const startSessionDialogTimer = ({ commit, dispatch }) => {
  let sessionDialogTimer = setTimeout(() => {
    commit("showDialog", {
      headerInfo: i18n.t("POL_SORRY_MESSAGE"),
      bodyInfo: i18n.t("POL_SESSION_EXPIRED"),
      bodyDescription: "",
      actionTitle: i18n.t("POL_OK"),
      onClose: () => dispatch("polApi/redirectToLogin", {}, { root: true }),
      onCloseDialog: () =>
        dispatch("polApi/redirectToLogin", {}, { root: true })
    });
  }, 5 * 60 * 1000);
  commit("setSessionDialogTimer", sessionDialogTimer);
};
