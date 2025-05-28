import authorizedAxiosInstance from "../utils/authorizedAxios";
import { API_ROOT } from "../utils/constants";

export var getProfile = async () => {
  return await authorizedAxiosInstance.get(`${API_ROOT}/api/v1/profile`, {});
};

export var updateProfileFullName = async (data) => {
  return await authorizedAxiosInstance.put(
    `${API_ROOT}/api/v1/profile/full-name`,
    data
  );
};

export var updateProfileEmail = async (data) => {
  return await authorizedAxiosInstance.put(
    `${API_ROOT}/api/v1/profile/email`,
    data
  );
};

export var updateProfilePhoneNumber = async (data) => {
  return await authorizedAxiosInstance.put(
    `${API_ROOT}/api/v1/profile/phone-number`,
    data
  );
};

export var updateProfileGender = async (data) => {
  return await authorizedAxiosInstance.put(
    `${API_ROOT}/api/v1/profile/gender`,
    data
  );
};

export var updateProfileAddress = async (data) => {
  return await authorizedAxiosInstance.put(
    `${API_ROOT}/api/v1/profile/address`,
    data
  );
};

export var updateProfileAvatar = async (data) => {
  return await authorizedAxiosInstance.put(
    `${API_ROOT}/api/v1/profile/avatar`,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};
