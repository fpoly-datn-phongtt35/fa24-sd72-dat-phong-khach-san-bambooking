package com.example.datn.controller;
import com.example.datn.model.TaiKhoan;
import com.example.datn.repository.TaiKhoanRepository;
import com.example.datn.service.TaiKhoanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
public class TaiKhoanController {
    @Autowired
    TaiKhoanService taiKhoanService;

    @Autowired
    TaiKhoanRepository taiKhoanRepository;

    @GetMapping("/tai-khoan")
    public List<TaiKhoan> getAll(){
        return taiKhoanRepository.findAll();
    }
    @PostMapping("/tai-khoan")
    public ResponseEntity<String> add(@RequestBody TaiKhoan taiKhoan) {
        try {
            taiKhoanService.create(taiKhoan);
            return ResponseEntity.status(HttpStatus.CREATED).body("Tài khoản đã được thêm thành công");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi khi thêm tài khoản: " + e.getMessage());
        }
    }

    @PutMapping("/tai-khoan/{id}")
    public ResponseEntity<String> update(@PathVariable Integer id, @RequestBody TaiKhoan taiKhoan) {
        try {
            taiKhoan.setId(id);
            taiKhoanService.update(taiKhoan);
            return ResponseEntity.status(HttpStatus.OK).body("tài khoản đã được cập nhật thành công");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi khi cập nhật tài khoản: " + e.getMessage());
        }
    }

    @DeleteMapping("/tai-khoan/{id}")
    public ResponseEntity<?> deleteTaiKhoan(@PathVariable Integer id) {
        taiKhoanService.deleteTaiKhoan(id);
        return ResponseEntity.ok("Tài khoản đã được xóa thành công!");
    }

    @GetMapping("/tai-khoan/search")
    public Page<TaiKhoan> searchTaiKhoan(@RequestParam(required = false) String keyword, Pageable pageable) {
        return taiKhoanService.searchTaiKhoan(keyword, pageable);
    }

}
