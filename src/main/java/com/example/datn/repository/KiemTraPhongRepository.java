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
            "AND xp.thongTinDatPhong.trangThai IN ('Dang o', 'Den han')")
    List<XepPhong> findByKeyNotChecked(@Param("key") String key);

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
