package com.example.datn.repository;

import com.example.datn.model.NhanVien;
import com.example.datn.model.TaiKhoan;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TaiKhoanRepository extends JpaRepository<TaiKhoan, Integer> {
    @Query("""
                select t
                from TaiKhoan t
                where t.tenDangNhap like %:keyword%
                and t.trangThai = TRUE
                """)
    Page<TaiKhoan> searchByName(@Param("keyword") String keyword, Pageable pageable);
    Optional<TaiKhoan> findByTenDangNhap(String tenDangNhap);
}
