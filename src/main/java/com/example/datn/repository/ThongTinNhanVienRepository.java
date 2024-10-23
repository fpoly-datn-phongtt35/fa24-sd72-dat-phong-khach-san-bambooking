package com.example.datn.repository;

import com.example.datn.model.ThongTinNhanVien;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ThongTinNhanVienRepository extends JpaRepository<ThongTinNhanVien, Long> {
    Optional<ThongTinNhanVien> findByTaiKhoan_TenDangNhap(String tenDangNhap);
}