package com.example.datn.controller;

import com.example.datn.dto.request.DanhGiaRequest;
import com.example.datn.dto.request.DatPhongRequest;
import com.example.datn.dto.response.DatPhongResponse;
import com.example.datn.model.KhachHang;
import com.example.datn.service.IMPL.DanhGiaServiceIMPL;
import com.example.datn.service.IMPL.KhachHangServiceIMPL;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RestController
@RequestMapping("/danh-gia")
public class DanhGiaController {
    @Autowired
    DanhGiaServiceIMPL danhGiaServiceIMPL;

    @PostMapping("/them-moi")
    public ResponseEntity<?> addDanhGia(@RequestBody DanhGiaRequest danhGiaRequest) {
        return ResponseEntity.status(HttpStatus.CREATED).body(danhGiaServiceIMPL.addDanhGia(danhGiaRequest));
    }

    @GetMapping("/hien-thi")
    public ResponseEntity<?> getAllDanhGia() {
        return ResponseEntity.ok(danhGiaServiceIMPL.getAllDanhGia());
    }

    @GetMapping("/getKhachHang")
    public ResponseEntity<KhachHang> getKhachHang(@RequestParam("idKhachHang") Integer idKhachHang) {
        return ResponseEntity.ok(danhGiaServiceIMPL.getKh(idKhachHang));
    }
}
