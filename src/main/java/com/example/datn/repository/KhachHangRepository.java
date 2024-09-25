package com.example.datn.repository;

import com.example.datn.model.KhachHang;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface KhachHangRepository extends JpaRepository<KhachHang,Integer> {
    @Query("SELECT kh FROM KhachHang kh " +
            "WHERE kh.gioiTinh LIKE %:keyword% " +
            "OR kh.sdt LIKE %:keyword% " +
            "OR kh.email LIKE %:keyword% " +
            "OR kh.trangThai LIKE %:keyword% "
    )
    List<KhachHang> search(@Param("keyword") String keyword);
}
