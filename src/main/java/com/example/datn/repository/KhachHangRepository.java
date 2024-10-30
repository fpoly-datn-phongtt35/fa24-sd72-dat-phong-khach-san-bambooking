package com.example.datn.repository;

import com.example.datn.model.KhachHang;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface KhachHangRepository extends JpaRepository<KhachHang,Integer> {
    @Query("""
        SELECT kh
        FROM KhachHang kh
        WHERE kh.ho LIKE %:keyword%
        OR kh.ten LIKE %:keyword%
        OR kh.sdt LIKE %:keyword%
        OR kh.email LIKE %:keyword%
        OR (CAST(:keyword AS string) = 'true' AND kh.trangThai = true)
        OR (CAST(:keyword AS string) = 'false' AND kh.trangThai = false)
        OR kh.gioiTinh LIKE %:keyword%
        OR kh.diaChi LIKE %:keyword%
       """)
    Page<KhachHang> search(@Param("keyword") String keyword, Pageable pageable);

    Optional<KhachHang> findByEmail(String email);
}
