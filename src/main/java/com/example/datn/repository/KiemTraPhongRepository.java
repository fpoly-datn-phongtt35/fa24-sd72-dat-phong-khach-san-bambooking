package com.example.datn.repository;

import com.example.datn.model.KiemTraPhong;
import com.example.datn.model.XepPhong;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface KiemTraPhongRepository extends JpaRepository<KiemTraPhong, Integer> {

    @Query("SELECT xp FROM XepPhong xp " +
            "WHERE (" +
            "LOWER(xp.thongTinDatPhong.datPhong.maDatPhong) LIKE LOWER(:key) " +
            "OR LOWER(xp.thongTinDatPhong.maThongTinDatPhong) LIKE LOWER(:key) " +
            "OR LOWER(xp.phong.maPhong) LIKE LOWER(:key) " +
            "OR LOWER(xp.phong.tenPhong) LIKE LOWER(:key) " +
            "OR LOWER(xp.thongTinDatPhong.datPhong.khachHang.sdt) LIKE LOWER(:key) " +
            "OR LOWER(xp.thongTinDatPhong.datPhong.khachHang.email) LIKE LOWER(:key) " +
            "OR LOWER(xp.thongTinDatPhong.datPhong.khachHang.ho) LIKE LOWER(:key) " +
            "OR LOWER(xp.thongTinDatPhong.datPhong.khachHang.ten) LIKE LOWER(:key) " +
            "OR LOWER(CONCAT(COALESCE(xp.thongTinDatPhong.datPhong.khachHang.ho, ''), ' ', COALESCE(xp.thongTinDatPhong.datPhong.khachHang.ten, ''))) LIKE LOWER(:key) " +
            ") " +
            "AND xp.thongTinDatPhong.trangThai IN (:trangThai)")
    List<XepPhong> findByKeyNotChecked(@Param("key") String key, @Param("trangThai") List<String> trangThai);

    //lấy danh sách phòng chưa kiểm tra
    @Query("""
                SELECT xp.phong.id, p.tenPhong
                FROM XepPhong xp
                JOIN xp.phong p
                JOIN xp.thongTinDatPhong ttdp
                JOIN ttdp.datPhong dp
                WHERE dp.maDatPhong = :maDatPhong
                AND NOT EXISTS (
                    SELECT 1 FROM KiemTraPhong ktp WHERE ktp.xepPhong.id = xp.id
                )
            """)
    List<Object[]> findUnverifiedRooms(String maDatPhong);
}
