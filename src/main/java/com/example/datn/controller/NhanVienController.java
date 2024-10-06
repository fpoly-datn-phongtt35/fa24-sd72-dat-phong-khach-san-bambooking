package com.example.datn.controller;

import com.example.datn.model.NhanVien;
import com.example.datn.service.NhanVienService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

//@CrossOrigin(origins = "*")
@CrossOrigin(origins = "*")

@RestController
public class NhanVienController {
    @Autowired
    NhanVienService nhanVienService;

    @GetMapping("/nhan-vien")
    public Page<NhanVien> getAll(Pageable pageable){
        return nhanVienService.getAll(pageable);
    }

    @PostMapping("/add/nhan-vien")
    public ResponseEntity<String> add(@RequestBody NhanVien nhanVien) {
        try {
            nhanVienService.create(nhanVien);
            return ResponseEntity.status(HttpStatus.CREATED).body("Nhân viên đã được thêm thành công");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi khi thêm nhân viên: " + e.getMessage());
        }
    }

    @PutMapping("/update/nhan-vien/{id}")
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


    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteNhanVien(@PathVariable Integer id) {
        // Logic xóa nhân viên
        nhanVienService.deleteNhanVien(id);
        return ResponseEntity.ok("Nhân viên đã được xóa thành công!");
    }


}
