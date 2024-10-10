package com.example.datn.controller;

import com.example.datn.model.KhachHang;
import com.example.datn.model.NhanVien;
import com.example.datn.repository.NhanVienRepository;
import com.example.datn.service.NhanVienService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*")

@RestController

public class NhanVienController {
    @Autowired
    NhanVienService nhanVienService;

    @Autowired
    NhanVienRepository nhanVienRepository;

    @GetMapping("/nhan-vien")
    public List<NhanVien> hienThi(){
        return nhanVienRepository.findAll();
    }


    @PostMapping("/nhan-vien")
    public ResponseEntity<String> addNhanVien(@RequestBody NhanVien nhanVien) {
        // Kiểm tra nếu số điện thoại đã tồn tại
        Optional<NhanVien> existingNhanVien = nhanVienService.findBySdt(nhanVien.getSdt());
        if (existingNhanVien.isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Số điện thoại đã tồn tại.");
        }
        // Thêm nhân viên mới
        nhanVienService.create(nhanVien);
        return ResponseEntity.ok("Thêm nhân viên thành công");
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

    @GetMapping("/nhan-vien/{id}")
    public ResponseEntity<NhanVien> getNhanVienById(@PathVariable Integer id) {
        NhanVien nhanVien = nhanVienService.getNhanVienById(id);
        if (nhanVien != null) {
            return ResponseEntity.ok(nhanVien);
        } else {
            return ResponseEntity.notFound().build(); // Trả về mã 404 nếu không tìm thấy nhân viên
        }
    }
}
