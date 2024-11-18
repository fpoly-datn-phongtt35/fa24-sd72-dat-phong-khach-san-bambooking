package com.example.datn.service;

import com.example.datn.dto.request.TraPhongRequest;
import com.example.datn.dto.response.TraPhongResponse;
import com.example.datn.model.TraPhong;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface TraPhongService {
    Page<TraPhongResponse> getAllTraPhong(Pageable pageable);
    TraPhongResponse createTraPhong(TraPhongRequest request);

    TraPhong checkOut(String maThongTinDatPhong);
}
