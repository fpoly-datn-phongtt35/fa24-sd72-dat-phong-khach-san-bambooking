import authorizedAxiosInstance from "../utils/authorizedAxios";
import { API_ROOT } from "../utils/constants";

export const fetchAllCustomer = async () => {
  return await authorizedAxiosInstance
    .get(`${API_ROOT}/api/v1/customer`)
    .then((res) => res.data);
};

export const updatStatus = async (id, status) => {
  await authorizedAxiosInstance.patch(
    `${API_ROOT}/api/v1/customer/update-status/${id}?status=${status}`
  );
};

export const newCustomer = async (data) => {
  await authorizedAxiosInstance.post(`${API_ROOT}/api/v1/customer`, data);
};
