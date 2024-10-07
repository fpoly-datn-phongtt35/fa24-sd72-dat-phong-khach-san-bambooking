package com.example.datn.service;

import com.example.datn.model.KhachHang;
import com.example.datn.model.LoaiPhong;

import java.util.List;

public interface LoaiPhongService {
    List<LoaiPhong> getAll();
    LoaiPhong findById(Integer id);
}
