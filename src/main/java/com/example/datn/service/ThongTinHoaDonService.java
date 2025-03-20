package com.example.datn.service;

import com.example.datn.dto.response.*;
import com.example.datn.model.ThongTinHoaDon;
import com.example.datn.model.TraPhong;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ThongTinHoaDonService {
    Page<ThongTinHoaDonResponse> getAllThongTinHoaDon(Pageable pageable);
    List<ThongTinHoaDonResponse> getThongTinHoaDonByHoaDonId(Integer idHoaDon);
    List<ThongTinHoaDon> createThongTinHoaDon(Integer idHD, List<TraPhong> listTraPhong);
    List<DichVuSuDungResponse> getDichVuSuDung(Integer idHoaDon);
    void capNhatTienKhauTru(Integer idHoaDon, Integer idThongTinHoaDon, Double tienKhauTru);
    List<PhuThuResponse> getPhuThu(Integer idHoaDon);
    List<KiemTraVatTuResponseList> getListVatTuHongOrThieuByHoaDon(Integer idHoaDon);
}
