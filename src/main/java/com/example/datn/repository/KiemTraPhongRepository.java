package com.example.datn.repository;

import com.example.datn.model.KiemTraPhong;
import com.example.datn.model.XepPhong;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface KiemTraPhongRepository extends JpaRepository<KiemTraPhong, Integer> {

    @Query("SELECT xp FROM XepPhong xp " +
           "WHERE (" +
           "LOWER(CAST(xp.thongTinDatPhong.datPhong.maDatPhong AS string)) = LOWER(:key) " +
           "OR LOWER(CAST(xp.thongTinDatPhong.maThongTinDatPhong AS string)) = LOWER(:key) " +
           "OR LOWER(CAST(xp.phong.maPhong AS string)) = LOWER(:key) " +
           "OR LOWER(xp.phong.tenPhong) = LOWER(:key) " +
           "OR LOWER(xp.thongTinDatPhong.datPhong.khachHang.sdt) = LOWER(:key) " +
           "OR LOWER(xp.thongTinDatPhong.datPhong.khachHang.email) = LOWER(:key) " +
           "OR LOWER(xp.thongTinDatPhong.datPhong.khachHang.ho) = LOWER(:key) " +
           "OR LOWER(xp.thongTinDatPhong.datPhong.khachHang.ten) = LOWER(:key) " +
           "OR LOWER(CONCAT(COALESCE(xp.thongTinDatPhong.datPhong.khachHang.ho, ''), ' ' , COALESCE(xp.thongTinDatPhong.datPhong.khachHang.ten, ''))) = LOWER(:key) " +
           ") " +
           "AND xp.thongTinDatPhong.trangThai IN (:trangThaiThongTinDatPhong)")
    List<XepPhong> findByKeyNotChecked(@Param("key") String key, List<String> trangThaiThongTinDatPhong);

    @Query("SELECT k FROM KiemTraPhong k WHERE k.xepPhong = :xepPhong")
    Optional<KiemTraPhong> findByXepPhong(XepPhong xepPhong);

    Optional<KiemTraPhong> findByXepPhongId(Integer id);

    List<KiemTraPhong> findByXepPhongIdIn(List<Integer> xepPhongIds);
}
