package com.example.datn.service;

import com.example.datn.dto.request.KiemTraPhongRequest;
import com.example.datn.dto.response.KiemTraPhongResponse;
import com.example.datn.dto.response.NhanVienResponse;
import com.example.datn.dto.response.VatTuResponseByNVT;
import com.example.datn.dto.response.XepPhongResponse;

import java.util.List;

public interface KiemTraPhongService {
    KiemTraPhongResponse performRoomCheck(KiemTraPhongRequest request);
    List<VatTuResponseByNVT> getVatTuByXepPhong(Integer idXepPhong);
    List<XepPhongResponse> timKiemXepPhong(String key);
    List<NhanVienResponse> findAllNhanVien();
}
