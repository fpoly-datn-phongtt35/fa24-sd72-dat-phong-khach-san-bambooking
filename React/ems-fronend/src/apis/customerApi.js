import authorizedAxiosInstance from "../utils/authorizedAxios";
import { API_ROOT } from "../utils/constants";

export const fetchAllCustomer = async (param) => {
  let uri = "/api/v1/customer?";
  let queryParams = [];
  if (param.pageNo !== null && param.pageNo !== undefined) {
    queryParams.push(`pageNo=${param.pageNo}`);
  }

  if (param.keyword) {
    queryParams.push(`keyword=${encodeURIComponent(param.keyword)}`);
  }

  uri += queryParams.join("&");
  return await authorizedAxiosInstance
    .get(`${API_ROOT}${uri}`)
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
