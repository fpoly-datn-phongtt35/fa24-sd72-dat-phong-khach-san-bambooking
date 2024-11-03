package com.example.datn.controller;

import com.example.datn.dto.request.HoaDonRequest;
import com.example.datn.dto.response.HoaDonResponse;
import com.example.datn.service.HoaDonService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("*")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/hoa-don")
public class HoaDonController {
    HoaDonService hoaDonService;

    @GetMapping
    public ResponseEntity<?> getAllHoaDon(
            @RequestParam(value = "trangThai", required = false) String trangThai,
            @RequestParam(value = "keyword", required = false) String keyword,
            Pageable pageable) {
        Page<HoaDonResponse> hoaDonResponses = hoaDonService.getHoaDonByTrangThai(trangThai, keyword, pageable);
        return ResponseEntity.ok(hoaDonResponses);
    }

    @PostMapping
    public ResponseEntity<?> createHoaDon(@RequestBody HoaDonRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(hoaDonService.createHoaDon(request));
    }

//    @GetMapping("/search")
//    public ResponseEntity<?> getTenDangNhap(@RequestParam(value = "tenDangNhap") String tenDangNhap) {
//        try {
//            return ResponseEntity.ok(hoaDonService.searchNhanVienByTenDangNhap(tenDangNhap));
//        } catch (Exception e) {
//            return ResponseEntity.badRequest().body("K lấy được tên đăng nhập");
//        }
//    }

}
