package com.example.datn.controller;

import com.example.datn.service.TaiKhoanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@CrossOrigin("*")
public class TaiKhoanController {
    @Autowired
    TaiKhoanService taiKhoanService;
    @GetMapping("/tai-khoan")
    public ResponseEntity<?> getAllPhong(Pageable pageable) {
        return ResponseEntity.ok(taiKhoanService.getAllTaiKhoan(pageable));
    }

}
