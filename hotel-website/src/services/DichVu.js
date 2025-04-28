import authorizedAxiosInstance from "../utils/authorizedAxios";

const api = "http://localhost:8080/api/dich_vu";

export const getAllServices = () => authorizedAxiosInstance.get(api);
