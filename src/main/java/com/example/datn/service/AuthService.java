package com.example.datn.service;

import com.example.datn.model.TaiKhoan;

public interface AuthService {
    TaiKhoan login(String tenDangNhap, String matKhau);
    TaiKhoan register(TaiKhoan taiKhoan);
}
