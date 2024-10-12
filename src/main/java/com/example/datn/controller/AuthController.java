package com.example.datn.controller;

import com.example.datn.model.TaiKhoan;
import com.example.datn.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody TaiKhoan taiKhoan) {
        boolean isAuthenticated = authService.login(taiKhoan.getTenDangNhap(), taiKhoan.getMatKhau());
        if (isAuthenticated) {
            return ResponseEntity.ok("Đăng nhập thành công!");
        } else {
            return ResponseEntity.status(401).body("Sai tên đăng nhập hoặc mật khẩu.");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<TaiKhoan> register(@RequestBody TaiKhoan taiKhoan) {
        TaiKhoan newTaiKhoan = authService.register(taiKhoan);
        return ResponseEntity.ok(newTaiKhoan);
    }

}
