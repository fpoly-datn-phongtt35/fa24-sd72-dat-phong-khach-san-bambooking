package com.example.datn.service;

import com.example.datn.dto.request.DanhGiaRequest;
import com.example.datn.model.DanhGia;
import com.example.datn.model.KhachHang;

import java.util.List;

public interface DanhGiaService {
     List<DanhGia> getAllDanhGia();
     DanhGia addDanhGia(DanhGiaRequest danhGiaRequest);

     KhachHang getKh(Integer idKhachHang);
}
