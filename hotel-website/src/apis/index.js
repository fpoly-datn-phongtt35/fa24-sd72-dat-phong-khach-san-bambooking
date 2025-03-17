import axios from "axios";
import { API_ROOT } from "../utils/constants";

export const refreshTokenAPI = async (refreshToken) => {
  return await axios.post(
    `${API_ROOT}/api/auth/refresh`,
    {},
    {
      headers: {
        AUTHORIZATION_REFRESH_TOKEN: `${refreshToken}`,
      },
    }
  );
};
