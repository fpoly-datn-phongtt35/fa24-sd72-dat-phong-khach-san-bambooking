package com.example.datn.repository;

import com.example.datn.model.NhanVien;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NhanVienRepository extends JpaRepository<NhanVien, Integer> {
    @Query("SELECT nv FROM NhanVien nv " +
            "WHERE nv.gioiTinh LIKE %:keyword% " +
            "OR nv.email LIKE %:keyword% " +
            "OR nv.sdt LIKE %:keyword% " +
            "OR nv.trangThai LIKE %:keyword% "
    )
    List<NhanVien> search(@Param("keyword") String keyword);
}
