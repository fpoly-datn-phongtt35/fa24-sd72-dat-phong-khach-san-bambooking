package com.example.datn.service;

import com.example.datn.dto.request.PhongRequest;
import com.example.datn.dto.response.PhongResponse;
import com.example.datn.model.LoaiPhong;
import com.example.datn.model.Phong;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface PhongService {
    Page<Phong> getAllPhong(Pageable pageable);
    Phong createPhong(PhongRequest request);
    PhongResponse getOnePhong(Integer id);
    PhongResponse updatePhong(Integer id, PhongRequest request);
    Boolean updateStatus(Integer id);
    Page<Phong> searchPhong(String keyword, Pageable pageable);
    List<Phong> searchPhongKhaDung(Integer idLoaiPhong);
}
