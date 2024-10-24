package com.example.datn.repository;

import com.example.datn.model.KhachHang;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface KhachHangRepository extends JpaRepository<KhachHang,Integer> {
    @Query("""
            SELECT kh
            FROM KhachHang kh
            where kh.ho like %:keyword%
            or  kh.ten like %:keyword%
            or kh.sdt like %:keyword%
            or kh.email like %:keyword%
            or kh.trangThai = TRUE
            or kh.gioiTinh like %:keyword%
            or kh.diaChi like %:keyword%
            """)
    Page<KhachHang> search(@Param("keyword") String keyword, Pageable pageable);
}
