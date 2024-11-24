package com.example.datn.repository;

import com.example.datn.dto.response.LoaiPhongKhaDungResponse;
import com.example.datn.dto.response.LoaiPhongResponse;
import com.example.datn.dto.response.TienIchResponse;
import com.example.datn.model.LoaiPhong;
import com.example.datn.model.TienIch;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface LoaiPhongRepository extends JpaRepository<LoaiPhong, Integer>{
    @Query("select new com.example.datn.dto.response.LoaiPhongResponse(lp.id," +
            "lp.tenLoaiPhong," +
            "lp.dienTich," +
            "lp.soKhachToiDa," +
            "lp.donGia," +
            "lp.donGiaPhuThu," +
            "lp.moTa)" +
            "from LoaiPhong lp")
    Page<LoaiPhongResponse> LoaiPhong(Pageable pageable);

    @Query("SELECT lp FROM LoaiPhong lp " +
            "WHERE (:tenLoaiPhong IS NULL OR lp.tenLoaiPhong LIKE %:tenLoaiPhong%)" +
            "    AND (:dienTichMin IS NULL OR lp.dienTich >= :dienTichMin)" +
            "    AND (:dienTichMax IS NULL OR lp.dienTich <= :dienTichMax )" +
            "    AND (:soKhach IS NULL OR lp.soKhachToiDa >= :soKhach)" +
            "    AND (:donGiaMin IS NULL OR lp.donGia >= :donGiaMin)" +
            "    AND (:donGiaMax IS NULL OR lp.donGia <= :donGiaMax)" +
            "    AND (:donGiaPhuThuMin IS NULL OR lp.donGiaPhuThu >=:donGiaPhuThuMin)" +
            "    AND (:donGiaPhuThuMax IS NULL OR lp.donGiaPhuThu <= :donGiaPhuThuMax)"
    )
    Page<LoaiPhong> filter (@Param("tenLoaiPhong") String tenLoaiPhong,
                           @Param("dienTichMin") Integer dienTichMin,
                           @Param("dienTichMax") Integer dienTichMax,
                           @Param("soKhach") Integer soKhach,
                           @Param("donGiaMin") Double donGiaMin,
                           @Param("donGiaMax") Double donGiaMax,
                           @Param("donGiaPhuThuMin") Double donGiaPhuThuMin,
                           @Param("donGiaPhuThuMax") Double donGiaPhuThuMax,
                           Pageable pageable);

    @Query("SELECT new com.example.datn.dto.response.LoaiPhongKhaDungResponse(lp.id, lp.tenLoaiPhong, lp.dienTich, " +
            "lp.soKhachToiDa, lp.donGia, lp.donGiaPhuThu, lp.moTa, COUNT(p) AS soLuongPhong, 0L AS soPhongKhaDung) " + // Để mặc định COUNT(p) là Long
            "FROM LoaiPhong lp " +
            "JOIN Phong p ON p.loaiPhong.id = lp.id " +
            "WHERE lp.soKhachToiDa >= :soNguoi " +
            "AND p.trangThai = true " +
            "GROUP BY lp.id, lp.tenLoaiPhong, lp.dienTich, lp.soKhachToiDa, lp.donGia, lp.donGiaPhuThu, lp.moTa")
    Page<LoaiPhongKhaDungResponse> findLoaiPhongWithTongSoPhong(
            @Param("soNguoi") Integer soNguoi,
            Pageable pageable);

    @Query("SELECT lp.id AS loaiPhongId, " +
            "(COUNT(p) - " +
            " (SELECT COUNT(xp) FROM XepPhong xp WHERE xp.phong.loaiPhong.id = lp.id " +
            " AND xp.ngayNhanPhong < :ngayTraPhong AND xp.ngayTraPhong > :ngayNhanPhong) - " +
            " (SELECT COUNT(tp) FROM ThongTinDatPhong tp WHERE tp.loaiPhong.id = lp.id " +
            " AND CAST(tp.ngayNhanPhong AS LocalDate) <= CAST(:ngayTraPhong AS LocalDate) " +
            " AND CAST(tp.ngayTraPhong AS LocalDate) >= CAST(:ngayNhanPhong AS LocalDate))" +
            ") AS soPhongTrong " +
            "FROM LoaiPhong lp " +
            "JOIN Phong p ON p.loaiPhong.id = lp.id " +
            "WHERE p.trangThai = true " +
            "GROUP BY lp.id")
    List<Object[]> findSoPhongTrong(
            @Param("ngayNhanPhong") LocalDateTime ngayNhanPhong,
            @Param("ngayTraPhong") LocalDateTime ngayTraPhong);










    @Query(value = "SELECT new com.example.datn.dto.response.LoaiPhongKhaDungResponse(lp.id, lp.tenLoaiPhong, lp.dienTich, " +
            "lp.soKhachToiDa, lp.donGia, lp.donGiaPhuThu, lp.moTa, COUNT(p) AS soLuongPhong, " +
            "(SUM(CASE WHEN p.trangThai = true THEN 1 ELSE 0 END) - " +
            " (SELECT COUNT(xp) " +
            "  FROM XepPhong xp " +
            "  WHERE xp.phong.loaiPhong.id = lp.id " +
            "    AND xp.ngayNhanPhong < :ngayTraPhong " +
            "    AND xp.ngayTraPhong > :ngayNhanPhong " +
            "    AND xp.trangThai = true) -" +
            " (SELECT COUNT(tp) " +
            "  FROM ThongTinDatPhong tp " +
            "  WHERE tp.loaiPhong.id = lp.id " +
            "    AND tp.ngayNhanPhong <= CAST(:ngayTraPhong AS LocalDate) " +
            "    AND tp.ngayTraPhong >= CAST(:ngayNhanPhong AS LocalDate) " +
            "    AND tp.trangThai IN ('Chua xep'))" +
            ") AS soPhongKhaDung) " +
            "FROM LoaiPhong lp " +
            "JOIN Phong p ON p.loaiPhong.id = lp.id " +
            "WHERE lp.soKhachToiDa >= :soNguoi " +
            "AND p.trangThai = true " +
            "GROUP BY lp.id, lp.tenLoaiPhong, lp.dienTich, lp.soKhachToiDa, lp.donGia, lp.donGiaPhuThu, lp.moTa " +
            "HAVING (SUM(CASE WHEN p.trangThai = true THEN 1 ELSE 0 END) - " +
            " (SELECT COUNT(xp) FROM XepPhong xp WHERE xp.phong.loaiPhong.id = lp.id " +
            " AND xp.ngayNhanPhong < :ngayTraPhong AND xp.ngayTraPhong > :ngayNhanPhong " +
            " AND xp.trangThai = true) - " +
            " (SELECT COUNT(tp) FROM ThongTinDatPhong tp WHERE tp.loaiPhong.id = lp.id " +
            " AND tp.ngayNhanPhong <= CAST(:ngayTraPhong AS LocalDate) " +
            " AND tp.ngayTraPhong >= CAST(:ngayNhanPhong AS LocalDate)" +
            " AND tp.trangThai IN ('Da xep', 'Chua xep', 'Dang o', 'Den han'))" +
            ") > 0",
            countQuery = "SELECT COUNT(DISTINCT lp.id) FROM LoaiPhong lp " +
                    "JOIN Phong p ON p.loaiPhong.id = lp.id " +
                    "WHERE lp.soKhachToiDa >= :soNguoi " +
                    "AND p.trangThai = true")
    Page<LoaiPhongKhaDungResponse> LoaiPhongKhaDung(
            @Param("ngayNhanPhong") LocalDateTime ngayNhanPhong,
            @Param("ngayTraPhong") LocalDateTime ngayTraPhong,
            @Param("soNguoi") Integer soNguoi,
            Pageable pageable);





























    LoaiPhong findLoaiPhongById(@Param("idLoaiPhong") Integer idLoaiPhong);

}
