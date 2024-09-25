package com.example.datn.service;

import com.example.datn.model.TaiKhoan;

import java.util.List;

public interface TaiKhoanService {
    List<TaiKhoan> findAll();
    void addTaiKhoan(TaiKhoan taiKhoan);
    TaiKhoan detailTaiKhoan(Integer id);
    void updateTaiKhoan(TaiKhoan taiKhoan);
    void updateStatusTaiKhoan(Integer id);
}
