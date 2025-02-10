package com.example.datn.service;

import com.example.datn.dto.request.ThanhToanRequest;
import com.example.datn.dto.response.ThanhToanResponse;
import com.example.datn.model.ThanhToan;
import jakarta.servlet.http.HttpServletRequest;


public interface ThanhToanService {
    ThanhToan createThanhToan(ThanhToanRequest thanhToanRequest, HttpServletRequest request);
    ThanhToanResponse updateThanhToan(Integer id, ThanhToanRequest thanhToanRequest ,HttpServletRequest request);
}
