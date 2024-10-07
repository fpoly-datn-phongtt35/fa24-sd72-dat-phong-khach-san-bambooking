package com.example.datn.service;

import com.example.datn.dto.request.DatPhongRequest;
import com.example.datn.dto.response.DatPhongResponse;
import com.example.datn.model.DatPhong;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface DatPhongService {

    Page<DatPhongResponse> getByTrangThai(String tt, Pageable pageable);
    List<DatPhong> getAll();
    DatPhong addDatPhong(DatPhongRequest datPhongRequest);

    DatPhongResponse detailDatPhong(Integer id);

    Page<DatPhongResponse> LocTheoTrangThai(List<String> trangThai,Pageable pageable);
    Page<DatPhongResponse> searchDatPhong(@Param("keyword") String keyword,@Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,Pageable pageable);
    DatPhong updateDatPhong(Integer id,DatPhongRequest datPhongRequest);
    Boolean update(DatPhong datPhong);
    Boolean delete(Integer id);
}
