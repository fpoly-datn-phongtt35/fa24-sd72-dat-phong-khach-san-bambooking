package com.example.datn.controller;

import com.example.datn.dto.request.ThongTinNhanVienRequest;
import com.example.datn.model.TaiKhoan;
import com.example.datn.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody TaiKhoan taiKhoan) {
        TaiKhoan authenticatedTaiKhoan = authService.login(taiKhoan.getTenDangNhap(), taiKhoan.getMatKhau());

        if (authenticatedTaiKhoan != null) {
            return ResponseEntity.ok(authenticatedTaiKhoan); // Trả về thông tin tài khoản nếu thành công
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Sai tên đăng nhập hoặc mật khẩu.");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<TaiKhoan> register(@RequestBody TaiKhoan taiKhoan) {
        TaiKhoan newTaiKhoan = authService.register(taiKhoan);
        return ResponseEntity.ok(newTaiKhoan);
    }

    @GetMapping("/thong-tin-nhan-vien")
    public ThongTinNhanVienRequest getThongTinNhanVien(@RequestParam String tenDangNhap) {
        return authService.getThongTinNhanVien(tenDangNhap);
    }




}
