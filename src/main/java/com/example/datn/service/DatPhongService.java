package com.example.datn.service;

import com.example.datn.dto.request.DatPhongRequest;
import com.example.datn.dto.response.DatPhongResponse;
import com.example.datn.model.DatPhong;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;

public interface DatPhongService {

    Page<DatPhongResponse> getByTrangThai(String tt, Pageable pageable);
    List<DatPhong> getAll();
    DatPhongResponse addDatPhong(DatPhongRequest datPhongRequest);
    DatPhongResponse detailDatPhong(Integer id);
    Page<DatPhongResponse> searchDatPhong(String keyword,LocalDateTime startDate,
            LocalDateTime endDate,Pageable pageable);
    DatPhong updateDatPhong(DatPhongRequest datPhongRequest);

    DatPhong findByMaDatPhong(String maDatPhong);

//    Double sumTotalAmountByIDDatPhong(Integer idDP);

    //Gnut
    Page<DatPhongResponse> findAll(String keyword, Pageable pageable);
    Page<DatPhong> getCanceledDatPhong(String maDatPhong, Pageable pageable);
    //
    DatPhong addDatPhongNgay(DatPhongRequest datPhongRequest);

    Page<DatPhong> DSDatPhong (Pageable pageable);

    void xoaDatPhong(Integer iddp);



}
