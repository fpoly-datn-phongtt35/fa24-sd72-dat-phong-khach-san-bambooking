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

export const signUp = async (email) => {
  return await axios.post(`${API_ROOT}/api/auth/sign-up?email=${email}`, {});
};

export const verifyCode = async (data) => {
  return await axios.post(`${API_ROOT}/api/auth/verify-code`, {
    code: data.code,
    encodedCode: data.encodedCode,
    email: data.email,
  });
};
