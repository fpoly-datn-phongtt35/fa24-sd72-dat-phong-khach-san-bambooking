package com.example.datn.controller;

import com.example.datn.model.KhachHang;
import com.example.datn.model.NhanVien;
import com.example.datn.service.NhanVienService;
import org.springframework.beans.factory.annotation.Autowired;
<<<<<<< HEAD
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
=======
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
>>>>>>> e1cf60d7331f5fd5c60f75207378ee6e2d2e7220
import org.springframework.web.bind.annotation.*;

import java.util.List;

<<<<<<< HEAD
@CrossOrigin(origins = "*")

=======
@CrossOrigin
>>>>>>> e1cf60d7331f5fd5c60f75207378ee6e2d2e7220
@RestController
@RequestMapping("nhan-vien")
public class NhanVienController {
    @Autowired
    NhanVienService nhanVienService;

<<<<<<< HEAD
    @PostMapping("/nhan-vien")
    public ResponseEntity<String> add(@RequestBody NhanVien nhanVien) {
        try {
            nhanVienService.create(nhanVien);
            return ResponseEntity.status(HttpStatus.CREATED).body("Nhân viên đã được thêm thành công");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi khi thêm nhân viên: " + e.getMessage());
        }
=======
    @GetMapping("hien-thi")
    public ResponseEntity<?> HienThiNhanVien() {
        List<NhanVien> kh = nhanVienServiceIMPL.getAll();
        return ResponseEntity.ok(kh);
>>>>>>> e1cf60d7331f5fd5c60f75207378ee6e2d2e7220
    }

    @PutMapping("/nhan-vien/{id}")
    public ResponseEntity<String> update(@PathVariable Integer id, @RequestBody NhanVien nhanVien) {
        try {
            // Gọi hàm trong service để cập nhật nhân viên, có thể cần kiểm tra ID
            nhanVien.setId(id); // Đảm bảo rằng đối tượng nhanVien có ID chính xác
            nhanVienService.update(nhanVien);
            return ResponseEntity.status(HttpStatus.OK).body("Nhân viên đã được cập nhật thành công");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi khi cập nhật nhân viên: " + e.getMessage());
        }
    }


    @DeleteMapping("/nhan-vien/{id}")
    public ResponseEntity<?> deleteNhanVien(@PathVariable Integer id) {
        // Logic xóa nhân viên
        nhanVienService.deleteNhanVien(id);
        return ResponseEntity.ok("Nhân viên đã được xóa thành công!");
    }

    @GetMapping("/nhan-vien/search")
    public Page<NhanVien> searchNhanVien(@RequestParam(required = false) String keyword, Pageable pageable) {
        return nhanVienService.searchNhanVien(keyword, pageable);
    }
}
