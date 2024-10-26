package com.example.datn.controller;

import com.example.datn.dto.request.KhachHangDatPhongRequest;
import com.example.datn.dto.request.KhachHangRequest;
import com.example.datn.service.KhachHangService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @PostMapping("/create-kh-dp")
    public ResponseEntity<?> createKhachHangDatPhong(@RequestBody KhachHangDatPhongRequest request){
        return ResponseEntity.status(HttpStatus.CREATED).body(khachHangService.createKhachHangDatPhong(request));
    }
}
