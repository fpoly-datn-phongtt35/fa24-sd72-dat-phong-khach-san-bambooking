package com.example.datn.service;

import com.example.datn.dto.request.PhongRequest;
import com.example.datn.dto.response.PhongResponse;
import com.example.datn.dto.response.PhongResponseDat;
import com.example.datn.model.Phong;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;

public interface PhongService {
    Page<Phong> getAllPhong(Pageable pageable);
    Phong createPhong(PhongRequest request);
    PhongResponse getOnePhong(Integer id);
    PhongResponse updatePhong(Integer id, PhongRequest request);
    Boolean updateStatus(Integer id);
    Page<Phong> searchPhong(String keyword, Pageable pageable);

    Page<PhongResponseDat> PhongKhaDung(LocalDateTime ngayNhanPhong, LocalDateTime ngayTraPhong ,
                                        Integer sucChuaLon,Integer sucChuaNho, Pageable pageable);
    //

    //Phong findPhongWithThongTinAndPhieuDichVu(Integer phongId, LocalDateTime currentTime);
    Phong getPhongById(Integer id);
}
