package com.example.datn.service;

import com.example.datn.dto.request.HoaDonRequest;
import com.example.datn.dto.response.HoaDonResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface HoaDonService {
    Page<HoaDonResponse> getHoaDonByTrangThai(String trangThai, Pageable pageable);
    HoaDonResponse createHoaDon(HoaDonRequest request);
    void changeStatusHoaDon(Integer idHoaDon);
    Page<HoaDonResponse> searchHoaDon(String keyword, Pageable pageable);
}
