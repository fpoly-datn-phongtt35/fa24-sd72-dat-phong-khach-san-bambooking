package com.example.datn.service;

import com.example.datn.dto.request.ThanhToanRequest;
import com.example.datn.dto.response.ThanhToanResponse;
import com.example.datn.model.ThanhToan;
import jakarta.servlet.http.HttpServletRequest;

import java.util.List;


public interface ThanhToanService {
    ThanhToan createThanhToan(ThanhToanRequest thanhToanRequest, HttpServletRequest request);
    ThanhToanResponse updateThanhToan(Integer id, ThanhToanRequest thanhToanRequest ,HttpServletRequest request);

    List<Object[]> thongKeDoanhThu();
    List<Object[]> thongKeLoaiPhong();
    List<Object[]> thongKeDichVu();
}
