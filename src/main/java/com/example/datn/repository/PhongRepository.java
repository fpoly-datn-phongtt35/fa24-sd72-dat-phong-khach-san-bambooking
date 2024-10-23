package com.example.datn.repository;

import com.example.datn.dto.response.PhongResponseDat;
import com.example.datn.model.Phong;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;


@Repository
public interface PhongRepository extends JpaRepository<Phong, Integer> {
    @Query("""
            select p
            from Phong p
            where p.maPhong like %:keyword%
            or p.tenPhong like %:keyword%
            or p.loaiPhong.tenLoaiPhong like %:keyword%
            or p.tinhTrang like %:keyword%
            or p.trangThai like %:keyword%
            """)
    Page<Phong> search(@Param("keyword") String keyword, Pageable pageable);


    @Query("SELECT new com.example.datn.dto.response.PhongResponseDat(p.id, p.loaiPhong.tenLoaiPhong, p.maPhong, p.tenPhong, p.giaPhong, " +
            " COALESCE((SELECT a.duongDan FROM HinhAnh a WHERE a.phong.id = p.id AND a.trangThai = 'hoat dong' ORDER BY a.id ASC LIMIT 1), '') " +
            ") FROM Phong p " +
            "LEFT JOIN ThongTinDatPhong t ON p.id = t.phong.id AND (:ngayNhanPhong IS NOT NULL AND :ngayTraPhong IS NOT NULL AND " +
            "      (t.ngayNhanPhong <= :ngayTraPhong AND t.ngayTraPhong >= :ngayNhanPhong)) " +
            "WHERE ( " +
            "   (:ngayNhanPhong IS NOT NULL AND :ngayTraPhong IS NOT NULL AND t.id IS NULL) " +
            "   AND (:sucChuaLon IS NOT NULL OR :sucChuaNho IS NOT NULL) " +
            "   AND (:sucChuaLon IS NULL OR p.loaiPhong.sucChuaLon >= :sucChuaLon) " +
            "   AND (:sucChuaNho IS NULL OR p.loaiPhong.sucChuaNho >= :sucChuaNho) " +
            "   AND (HOUR(:ngayNhanPhong) >= 14 AND HOUR(:ngayNhanPhong) <= 22) " +
            "   AND (HOUR(:ngayTraPhong) <= 12) " +
            "   AND ( " +
            "       (t.ngayTraPhong < :ngayNhanPhong) " +
            "       OR (t.ngayNhanPhong > :ngayTraPhong) " +
            "   )" +
            ")")
    Page<PhongResponseDat> PhongKhaDung(@Param("ngayNhanPhong") LocalDateTime ngayNhanPhong,
                                        @Param("ngayTraPhong") LocalDateTime ngayTraPhong,
                                        @Param("sucChuaLon") Integer sucChuaLon,
                                        @Param("sucChuaNho") Integer sucChuaNho,
                                        Pageable pageable);






}
