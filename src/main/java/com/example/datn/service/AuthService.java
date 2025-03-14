package com.example.datn.service;

import com.example.datn.dto.request.ThongTinNhanVienRequest;
import com.example.datn.dto.request.auth.SigninRequest;
import com.example.datn.dto.response.auth.TokenResponse;
import com.example.datn.model.TaiKhoan;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;

@Service
public interface AuthService {
    TaiKhoan login(String tenDangNhap, String matKhau);
    TaiKhoan register(TaiKhoan taiKhoan);
    ThongTinNhanVienRequest getThongTinNhanVien(String tenDangNhap);

    TokenResponse authenticate(SigninRequest signinRequest);

    TokenResponse refresh(HttpServletRequest request);
}
