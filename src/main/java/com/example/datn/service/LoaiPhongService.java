package com.example.datn.service;
import com.example.datn.dto.request.LoaiPhongRequest;
import com.example.datn.dto.request.TienIchRequest;
import com.example.datn.dto.response.LoaiPhongKhaDungResponse;
import com.example.datn.dto.response.LoaiPhongResponse;
import com.example.datn.dto.response.TienIchResponse;
import com.example.datn.model.LoaiPhong;
import com.example.datn.model.TienIch;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface LoaiPhongService {

    List<LoaiPhong> getAllLoaiPhong();

    Page<LoaiPhongResponse> getPage(Pageable pageable);

    public LoaiPhong add(LoaiPhongRequest loaiPhong);

    public LoaiPhong detail(Integer id);

    public void delete(Integer id);

    LoaiPhong update(LoaiPhongRequest loaiPhongRequest);

    Page<LoaiPhong> search ( String tenLoaiPhong, Pageable pageable);

    Page<LoaiPhongKhaDungResponse> LoaiPhongKhaDung(LocalDateTime ngayNhanPhong, LocalDateTime ngayTraPhong, Pageable pageable);
    LoaiPhong findByID(Integer idLoaiPhong);
}
