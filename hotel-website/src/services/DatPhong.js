import authorizedAxiosInstance from '../utils/authorizedAxios';

const apiGetDP = "http://localhost:8080/api/dp/lich-su-dp"

export const getDatPhongbyTDN = (tenDangNhap,pageable) => {
    return authorizedAxiosInstance.get(apiGetDP, {
        params: {
            tenDangNhap: tenDangNhap,
            page: pageable.page ?? 0,
            size: pageable.size ?? 5
        }
    });
};
