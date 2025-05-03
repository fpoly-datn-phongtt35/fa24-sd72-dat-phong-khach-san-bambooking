import authorizedAxiosInstance from '../utils/authorizedAxios';
const apiGetDP = "http://localhost:8080/api/dp/lich-su-dp"
const apiToHopLoaiPhong =
  "http://localhost:8080/api/dp/to-hop-loai-phong-kha-dung";

  const apiCreateKHDP = "http://localhost:8080/api/kh/create-kh-dp";
  const apiDPAdd = "http://localhost:8080/api/dp/them-moi";
  const apiTTDPAdd = "http://localhost:8080/api/ttdp/them-moi";
  const apiUpdateKHDP = "http://localhost:8080/api/kh/update-kh-dp";
  const apiDPUpdate = "http://localhost:8080/api/dp/cap-nhat";
  const apiTTDP = "http://localhost:8080/api/ttdp/hien-thi-by-iddp";
  const apiUpdate = "http://localhost:8080/api/ttdp/sua";
  const apiHuyTTDP = "http://localhost:8080/api/ttdp/huy-ttdp";
  const apiXoaDatPhong = "http://localhost:8080/api/dp/xoa";
  const apiDeleteKHDP = "http://localhost:8080/api/kh/delete-kh-dp";
  const apiGetDPByUsername = "http://localhost:8080/api/kh/get-by-username";
  const apiGetLPKDL = "http://localhost:8080/api/loai-phong/loai-phong-kha-dung-list";
  const apiTracuuLSDP = "http://localhost:8080/api/tra-cuu/search-lich-su-dp";
  const apigetLSDPbyEmail = "http://localhost:8080/api/tra-cuu/lich-su-dp"

  const apiGuiEmailXacNhan= "http://localhost:8080/api/dp/gui-email-xac-nhan-dp"
  const apiGuiEmailXacNhanSauUDKH= "http://localhost:8080/api/dp/gui-email-xac-nhan-dp-sau-UD-KH"
  const apiXacNhanDP= "http://localhost:8080/api/dp/xac-nhan-dp"
  const apiTBDatPhongThanhCong = "http://localhost:8080/api/dp/email-dp-thanh-cong";
  const apiUpdateKH = "http://localhost:8080/api/kh/update-kh";
  const apiHuyDP = "http://localhost:8080/api/dp/huy-dat-phong"
  const apiGuiEmailXacNhanHuyDP = "http://localhost:8080/api/dp/email-xac-nhan-huy-dp"



export const getDatPhongbyTDN = (tenDangNhap,keyword,ngayNhanPhong,ngayTraPhong) => {
    return authorizedAxiosInstance.get(apiGetDP, {
        params: {
            tenDangNhap: tenDangNhap,
            keyword: keyword,
            ngayNhanPhong: ngayNhanPhong,
            ngayTraPhong: ngayTraPhong
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

export const ThemKhachHangDatPhong = (khachHangRequest) => {
  return authorizedAxiosInstance.post(apiCreateKHDP, khachHangRequest);
};

export const ThemMoiDatPhong = (DatPhongRequest) => {
  return authorizedAxiosInstance.post(apiDPAdd, DatPhongRequest);
};

export const addThongTinDatPhong = (TTDPRequest) => {
    return authorizedAxiosInstance.post(apiTTDPAdd, TTDPRequest);
};

export const SuaKhachHangDatPhong = (khachHangRequest) => {
  return authorizedAxiosInstance.put(apiUpdateKHDP, khachHangRequest);
};

export const UpdateKH = (khachHangRequest) => {
  return authorizedAxiosInstance.put(apiUpdateKH, khachHangRequest);
};


export const CapNhatDatPhong = (DatPhongRequest) => {
  return authorizedAxiosInstance.put(apiDPUpdate, DatPhongRequest);
};

export const getThongTinDatPhong = (idDP) => {
    return authorizedAxiosInstance.get(apiTTDP, {
        params: {
            idDP: idDP
        }
    });
};

export const updateThongTinDatPhong = (TTDPRequest) => {
    return authorizedAxiosInstance.put(apiUpdate, TTDPRequest);
};

export const huyTTDP = (maThongTinDatPhong) => {
    return authorizedAxiosInstance.get(apiHuyTTDP, {
        params: {
            maThongTinDatPhong:maThongTinDatPhong
        }
    });
};

export const XoaDatPhong = (iddp) => {
  return authorizedAxiosInstance.delete(apiXoaDatPhong, iddp);
};


export const XoaKhachHangDatPhong = (khachHang) => {
  return authorizedAxiosInstance.delete(apiDeleteKHDP, khachHang);
};


export const getKhachHangByUsername = (username) => {
  return authorizedAxiosInstance.get(apiGetDPByUsername, {
    params: {
      userName: username,
    },
  });
};

export const getLPKDR = (ngayNhanPhong, ngayTraPhong) => {
    return authorizedAxiosInstance.get(apiGetLPKDL, {
      params: {
        ngayNhanPhong,
        ngayTraPhong,
      },
    });
};

export const getTracuuLSDP = (keyword) => {
  return authorizedAxiosInstance.get(apiTracuuLSDP, {
      params: {
          keyword: keyword
      }
  });
};

export const getLSDPbyEmail = (email) => {
  return authorizedAxiosInstance.get(apigetLSDPbyEmail, {
      params: {
        email: email
      }
  });
};

export const GuiEmailXacNhanDP = (idDatPhong) => {
  return authorizedAxiosInstance.get(apiGuiEmailXacNhan, {
    params:{
      idDatPhong: idDatPhong
    }
  });
};

export const XacNhanDP = (iddp) => {
  return authorizedAxiosInstance.get(apiXacNhanDP, {
      params: {
        iddp: iddp
      }
  });
};

export const EmailXacNhanDPThanhCong = (iddp) => {
  return authorizedAxiosInstance.get(apiTBDatPhongThanhCong, {
      params: {
        iddp: iddp
      }
  });
};

export const GuiEmailXacNhanDPSauUDKH = (idDP) => {
  return authorizedAxiosInstance.get(apiGuiEmailXacNhanSauUDKH, {
      params: {
          idDatPhong: idDP
      }
  });
};

export const HuyDP = (idDatPhong) => {
  return authorizedAxiosInstance.get(apiHuyDP, {
      params: {
          idDatPhong: idDatPhong,
      }
  });
};

export const GuiEmailXacNhanHuyDP = (idDP) => {
  return authorizedAxiosInstance.get(apiGuiEmailXacNhanHuyDP, {
      params: {
          idDatPhong: idDP
      }
  });
};