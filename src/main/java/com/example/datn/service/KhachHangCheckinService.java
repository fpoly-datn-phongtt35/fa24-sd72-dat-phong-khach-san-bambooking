package com.example.datn.service;

import com.example.datn.dto.request.KhachHangCheckinRequest;
import com.example.datn.model.KhachHang;
import com.example.datn.model.KhachHangCheckin;
import com.example.datn.model.XepPhong;

import java.util.List;

public interface KhachHangCheckinService {
    KhachHangCheckin add(KhachHangCheckinRequest request);
    KhachHangCheckin update(KhachHangCheckinRequest request);
    List<KhachHangCheckin> findsByMaTTDP(String maThongTinDatPhong);
    Boolean xoa(Integer id);
}
