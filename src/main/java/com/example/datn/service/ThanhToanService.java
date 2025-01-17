package com.example.datn.service;

import com.example.datn.dto.request.ThanhToanRequest;
import com.example.datn.dto.response.ThanhToanResponse;
import com.example.datn.model.ThanhToan;

public interface ThanhToanService {
    ThanhToan createThanhToan(ThanhToanRequest request);
    ThanhToanResponse updateThanhToan(Integer id, ThanhToanRequest request);
}
