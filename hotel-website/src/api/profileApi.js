import authorizedAxiosInstance from "../utils/authorizedAxios";
import { API_ROOT } from "../utils/constants";

export var getProfile = async () => {
  return await authorizedAxiosInstance.get(`${API_ROOT}/api/v1/profile`, {});
};
