import authorizedAxiosInstance from '../utils/authorizedAxios';
const apiGetDP = "http://localhost:8080/api/dp/lich-su-dp"
const apiToHopLoaiPhong =
  "http://localhost:8080/api/dp/to-hop-loai-phong-kha-dung";
export const getDatPhongbyTDN = (tenDangNhap,pageable) => {
    return authorizedAxiosInstance.get(apiGetDP, {
        params: {
            tenDangNhap: tenDangNhap,
            page: pageable.page ?? 0,
            size: pageable.size ?? 5
        }
    });
};

export const toHopLoaiPhong = async (
  ngayNhanPhong,
  ngayTraPhong,
  soNguoi,
  key,
  tongChiPhiMin,
  tongChiPhiMax,
  tongSucChuaMin,
  tongSucChuaMax,
  tongSoPhongMin,
  tongSoPhongMax,
  loaiPhongChons,
  pageable
) => {
  const response = await authorizedAxiosInstance.post(
    apiToHopLoaiPhong,
    {
      ngayNhanPhong,
      ngayTraPhong,
      soNguoi,
      key,
      tongChiPhiMin: tongChiPhiMin || null,
      tongChiPhiMax: tongChiPhiMax || null,
      tongSucChuaMin: tongSucChuaMin || null,
      tongSucChuaMax: tongSucChuaMax || null,
      tongSoPhongMin: tongSoPhongMin || null,
      tongSoPhongMax: tongSoPhongMax || null,
      loaiPhongChons,
    },
    {
      params: {
        page: pageable.page,
        size: pageable.size,
      },
    }
  );
  return response.data;
};