package com.example.datn.repository;

import com.example.datn.model.XepPhong;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface XepPhongRepository extends JpaRepository<XepPhong, Integer> {
    @Query("select xp from XepPhong xp join ThongTinDatPhong ttdp on xp.thongTinDatPhong.id = ttdp.id" +
            "  where xp.thongTinDatPhong.maThongTinDatPhong =:maTTDP")
    XepPhong getByMaTTDP(String maTTDP);

    @Query("SELECT xp FROM XepPhong xp " +
            "WHERE xp.phong.id = :idPhong " +
            "AND (CAST(:date AS DATE) >= CAST(xp.ngayNhanPhong AS DATE) " +
            "AND CAST(:date AS DATE) <= CAST(xp.ngayTraPhong AS DATE))")
    XepPhong getByIDPhong(@Param("idPhong") int idPhong, @Param("date") LocalDateTime date);

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
    List<XepPhong> findByKey(@Param("key") String key, List<String> trangThaiThongTinDatPhong);

}
