import axios from "axios";
import { refreshTokenAPI } from "../apis";

let authorizedAxiosInstance = axios.create();

authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 10;

authorizedAxiosInstance.interceptors.request.use(
  (config) => {
    const access_token = localStorage.getItem("accessToken");

    config.headers.Authorization =
      !config._retry && access_token
        ? `Bearer ${access_token}`
        : config.headers.Authorization;

    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

authorizedAxiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error?.response?.status === 401) {
      if (localStorage.getItem("accessToken")) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        location.href = "/login";
      }
    }

    const originalRequest = error.config;
    if (error.response?.status === 410 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refreshToken");
      return refreshTokenAPI(refreshToken)
        .then((res) => {
          const access_token = res.data.accessToken;

          localStorage.setItem("accessToken", access_token);
          authorizedAxiosInstance.defaults.headers.Authorization = `Bearer ${access_token}`;

          originalRequest.headers["Authorization"] = `Bearer ${access_token}`;

          return authorizedAxiosInstance(originalRequest);
        })
        .catch((_error) => {
          console.log(_error);
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
          location.href = "/login";

          return Promise.reject(_error);
        });
    }

    if (error?.response?.status === 403) {
      location.href = "/";
      return Promise.reject(error);
    }
    if (error?.response?.status !== 410) {
      console.log(error.response?.data?.message || error?.message);

      // toast.error(error.response?.data?.message || error?.message);
    }
    return Promise.reject(error);
  }
);

export default authorizedAxiosInstance;
