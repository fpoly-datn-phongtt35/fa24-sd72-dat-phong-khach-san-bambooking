package com.example.datn.controller;

import com.example.datn.dto.request.KhachHangRequest;
import com.example.datn.model.KhachHang;
import com.example.datn.service.KhachHangService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.security.SecureRandom;
import java.util.Base64;

@CrossOrigin("*")
@RestController
@RequestMapping("/khach-hang")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class KhachHangController {

    KhachHangService khachHangService;

    @GetMapping("")
    public ResponseEntity<?> getAllKhachHang(Pageable pageable){
        return ResponseEntity.ok(khachHangService.getAllKhachHang(pageable));
    }

    @PostMapping("")
    public ResponseEntity<?> createKhachHang(@RequestBody @Valid KhachHangRequest request){
        return ResponseEntity.status(HttpStatus.CREATED).body(khachHangService.createKhachHang(request));
    }

    @GetMapping("{id}")
    public ResponseEntity<?> getOneKhachHang(@PathVariable("id") Integer id){
        return ResponseEntity.ok(khachHangService.getOneKhachHang(id));
    }

    @PutMapping("{id}")
    public ResponseEntity<?> updateKhachHang(@PathVariable("id") Integer id, @RequestBody @Valid KhachHangRequest request){
        return ResponseEntity.status(HttpStatus.OK).body(khachHangService.updateKhachHang(id, request));
    }

    @DeleteMapping("{id}")
    public ResponseEntity<?> deleteKhachHang(@PathVariable("id") Integer id){
        khachHangService.deleteKhachHang(id);
        return ResponseEntity.ok("Xóa khách hàng có id: " + id + "thành công !");
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchKhachHang(@RequestParam(value = "keyword", required = false) String keyword, Pageable pageable){
        return ResponseEntity.status(HttpStatus.OK).body(khachHangService.searchKhachHang(keyword, pageable));
    }

    @PostMapping("/register")
    public ResponseEntity<String> registerCustomer(@RequestBody KhachHangRequest request) {
        String email = request.getEmail();  // Lấy email người dùng nhập

        // Kiểm tra email có hợp lệ không
        if (email == null || email.isEmpty()) {
            return ResponseEntity.badRequest().body("Email không được để trống.");
        }

        // Tạo mật khẩu ngẫu nhiên
        String generatedPassword = khachHangService.generatePassword();

        // Gửi mật khẩu qua email cho người dùng
        khachHangService.sendPasswordEmail(email, generatedPassword);

        return ResponseEntity.ok("Đăng ký thành công! Vui lòng kiểm tra email.");
    }

}
