package com.example.datn.controller;

import com.example.datn.service.TaiKhoanService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin("*")
@RequestMapping("/tai-khoan")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class TaiKhoanController {
    TaiKhoanService taiKhoanService;

    @GetMapping("")
    public ResponseEntity<?> getAllTaiKhoan(Pageable pageable){
        return ResponseEntity.ok(taiKhoanService.findAll(pageable));
    }


}
