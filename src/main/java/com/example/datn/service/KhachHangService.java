package com.example.datn.service;

import com.example.datn.model.KhachHang;

import java.util.List;

public interface KhachHangService {
    List<KhachHang> getAll();
    KhachHang findById(Integer id);
    void addKhachHang(KhachHang khachHang);
    void updateKhachHang(KhachHang khachHang);
    void updateTrangThaiKhachHang(Integer id);
    List<KhachHang> search(String keyword);
}
