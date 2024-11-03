package com.example.datn.controller;

import com.example.datn.model.KhachHangRegister;
import com.example.datn.service.KhachHangService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Map;

@CrossOrigin("*")
@RestController
public class KhachHangLoginController {
    @Autowired
    private KhachHangService khachHangService;

    @PostMapping("/sign-in")
    public ResponseEntity<Map<String, String>> login(@RequestBody KhachHangRegister request) {
        System.out.println("Đã nhận yêu cầu đăng nhập từ: " + request.getEmail());
        boolean isAuthenticated = khachHangService.checkLogin(request.getEmail(), request.getMatKhau());

        if (isAuthenticated) {
            // Trả về một đối tượng JSON với thông điệp đăng nhập thành công
            return ResponseEntity.ok(Collections.singletonMap("message", "Đăng nhập thành công!"));
        } else {
            // Trả về một đối tượng JSON với thông điệp lỗi
            return ResponseEntity.status(401).body(Collections.singletonMap("message", "Email hoặc mật khẩu không chính xác."));
        }
    }


}
