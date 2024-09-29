package com.example.datn.service;

import com.example.datn.dto.response.DatPhongResponse;
import com.example.datn.model.DatPhong;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface DatPhongService {

    Page<DatPhongResponse> getByTrangThai(String tt, Pageable pageable);
    List<DatPhong> getAll();
    Boolean add(DatPhong datPhong);
    Boolean update(DatPhong datPhong);
    Boolean delete(Integer id);
}
