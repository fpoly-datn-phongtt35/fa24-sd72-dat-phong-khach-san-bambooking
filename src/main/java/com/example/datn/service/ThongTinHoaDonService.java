package com.example.datn.service;

import com.example.datn.dto.request.ThongTinHoaDonRequest;
import com.example.datn.dto.response.ThongTinHoaDonResponse;
import com.example.datn.model.ThongTinHoaDon;
import com.example.datn.model.TraPhong;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ThongTinHoaDonService {
    Page<ThongTinHoaDonResponse> getAllThongTinHoaDon(Pageable pageable);
    List<ThongTinHoaDonResponse> getThongTinHoaDonByHoaDonId(Integer idHoaDon);
    List<ThongTinHoaDon> createThongTinHoaDon(Integer idHD, List<TraPhong> listTraPhong);
//    void tongTienHoaDon();
}
