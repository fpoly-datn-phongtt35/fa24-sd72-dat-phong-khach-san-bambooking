package com.example.datn.service;

import com.example.datn.dto.request.KhachHangCheckinRequest;
import com.example.datn.model.KhachHang;
import com.example.datn.model.KhachHangCheckin;
import com.example.datn.model.XepPhong;

public interface KhachHangCheckinService {
    KhachHangCheckin add(KhachHang khachHang, XepPhong xepPhong);
    KhachHangCheckin update(KhachHangCheckinRequest request);
}
