import { DeviceId, DetectDevice } from "@/shared";

const defaultHeaders = (state, getters, rootState) => {
  return {
    deviceid: DeviceId.getDeviceId(),
    deviceDna:
      typeof rootState.ui.deviceDna === Object
        ? JSON.stringify(rootState.ui.deviceDna)
        : rootState.ui.deviceDna,
    session: rootState.ui.authParams.session,
    sourceKey: rootState.ui.registrationForm.userId,
    applicationSource: `${rootState.ui.applicationSource}-REG`,
    userId: rootState.ui.registrationForm.userId
  };
};

const deviceName = () => DetectDevice.getDeviceName();

export { defaultHeaders, deviceName };
