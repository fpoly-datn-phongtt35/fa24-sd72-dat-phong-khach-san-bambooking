package com.example.datn.repository;

import com.example.datn.model.DanhGia;
import com.example.datn.model.KhachHang;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DanhGiaRepository extends JpaRepository<DanhGia,Integer> {
    @Query("SELECT dg FROM DanhGia dg WHERE dg.trangThai = :trangThai " +
            "ORDER BY dg.stars DESC")
    List<DanhGia> getAllDanhGia(String trangThai);
}
