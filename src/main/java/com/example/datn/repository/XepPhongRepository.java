package com.example.datn.repository;

import com.example.datn.model.ThongTinDatPhong;
import com.example.datn.model.XepPhong;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface XepPhongRepository extends JpaRepository<XepPhong, Integer> {
    @Query("select xp from XepPhong xp join ThongTinDatPhong ttdp on xp.thongTinDatPhong.id = ttdp.id" +
            "  where xp.thongTinDatPhong.maThongTinDatPhong =:maTTDP")
    XepPhong getByMaTTDP(String maTTDP);

    @Query("SELECT xp FROM XepPhong xp " +
            "LEFT JOIN TraPhong tp ON tp.xepPhong.id = xp.id " +
            "WHERE xp.phong.id = :idPhong " +
            "AND :date >= xp.ngayNhanPhong " +
            "AND :date <= CASE WHEN tp.id IS NOT NULL AND tp.trangThai = true " +
            "                 THEN COALESCE(tp.ngayTraThucTe, xp.ngayTraPhong) " +
            "                 ELSE xp.ngayTraPhong END " )
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

    @Query("""
        SELECT xp
        FROM XepPhong xp
        JOIN xp.phong p
        JOIN xp.thongTinDatPhong ttdp
        WHERE p.tinhTrang = :tinhTrang AND xp.trangThai = :trangThai
        """)
    List<XepPhong> findByPhongTinhTrangAndTrangThai(String tinhTrang, String trangThai);

    List<XepPhong> findByThongTinDatPhongId(Integer thongTinDatPhongId);
    Optional<XepPhong> findById(Integer id);

    @Query("SELECT xp FROM XepPhong xp WHERE xp.thongTinDatPhong.datPhong.id = :datPhongId")
    List<XepPhong> findByDatPhongId(Integer datPhongId);
    Optional<XepPhong> findByThongTinDatPhong_Id(Integer idThongTinDatPhong);

    @Query("""
        SELECT xp
        FROM XepPhong xp
        JOIN xp.phong p
        JOIN xp.thongTinDatPhong ttdp
        WHERE p.tinhTrang IN (:tinhTrang) AND xp.trangThai IN (:trangThai)
        """)
    List<XepPhong> findByList(List<String> tinhTrang, List<String> trangThai);
}
