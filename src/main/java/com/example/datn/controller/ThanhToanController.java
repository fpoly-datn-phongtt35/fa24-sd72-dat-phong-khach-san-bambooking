package com.example.datn.controller;

import com.example.datn.dto.request.ThanhToanRequest;
import com.example.datn.service.ThanhToanService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("*")
@RequestMapping("thanh-toan")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ThanhToanController {
    ThanhToanService thanhToanService;

    @PostMapping
    public ResponseEntity<?> createThanhToan(@RequestBody @Valid ThanhToanRequest thanhToanRequest, HttpServletRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(thanhToanService.createThanhToan(thanhToanRequest, request));
    }

    @PutMapping
    public ResponseEntity<?> updateThanhToan(@RequestParam("id") Integer id, @RequestBody ThanhToanRequest thanhToanRequest, HttpServletRequest request) {
        return ResponseEntity.status(HttpStatus.OK).body(thanhToanService.updateThanhToan(id, thanhToanRequest, request));
    }

}
