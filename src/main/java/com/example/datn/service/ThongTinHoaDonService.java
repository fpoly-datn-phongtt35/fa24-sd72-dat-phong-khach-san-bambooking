package com.example.datn.service;

import com.example.datn.dto.request.ThongTinHoaDonRequest;
import com.example.datn.dto.response.ThongTinHoaDonResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ThongTinHoaDonService {
    Page<ThongTinHoaDonResponse> getAllThongTinHoaDon(Pageable pageable);
    ThongTinHoaDonResponse createThongTinHoaDon(ThongTinHoaDonRequest request);
}
