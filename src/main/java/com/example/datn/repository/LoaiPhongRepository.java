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
            "WHERE lp.tenLoaiPhong LIKE %:tenLoaiPhong% "
    )
    Page<LoaiPhong> search(@Param("tenLoaiPhong") String keyword, Pageable pageable);

    @Query("SELECT new com.example.datn.dto.response.LoaiPhongKhaDungResponse(lp.id, lp.tenLoaiPhong, lp.dienTich, " +
            "lp.soKhachToiDa, lp.donGia, lp.donGiaPhuThu, lp.moTa, COUNT(p) AS tongSoPhong, " +
            "SUM(CASE WHEN (xp.id IS NULL OR (xp.ngayTraPhong <= :ngayNhanPhong OR xp.ngayNhanPhong >= :ngayTraPhong)) " +
            "AND (tp.id IS NULL OR (tp.ngayTraPhong < CAST(:ngayNhanPhong AS DATE) " +
            "OR tp.ngayNhanPhong > CAST(:ngayTraPhong AS DATE))) THEN 1 ELSE 0 END) AS soPhongTrong) " +
            "FROM LoaiPhong lp " +
            "JOIN Phong p ON p.loaiPhong.id = lp.id " +
            "LEFT JOIN XepPhong xp ON p.id = xp.phong.id " +
            "LEFT JOIN ThongTinDatPhong tp ON tp.loaiPhong.id = lp.id " +
            "WHERE p.trangThai = true " +
            "AND lp.soKhachToiDa >= :soNguoi " +
            "AND p.tinhTrang = 'available' " +
            "GROUP BY lp.id, lp.tenLoaiPhong, lp.dienTich, lp.soKhachToiDa, lp.donGia, lp.donGiaPhuThu, lp.moTa " +
            "HAVING SUM(CASE WHEN (xp.id IS NULL OR (xp.ngayTraPhong <= :ngayNhanPhong OR xp.ngayNhanPhong >= :ngayTraPhong)) " +
            "AND (tp.id IS NULL OR (tp.ngayTraPhong < CAST(:ngayNhanPhong AS DATE) " +
            "OR tp.ngayNhanPhong > CAST(:ngayTraPhong AS DATE))) THEN 1 ELSE 0 END) > 0")
    Page<LoaiPhongKhaDungResponse> LoaiPhongKhaDung(
            @Param("ngayNhanPhong") LocalDateTime ngayNhanPhong,
            @Param("ngayTraPhong") LocalDateTime ngayTraPhong,
            @Param("soNguoi") Integer soNguoi,
            Pageable pageable);













    LoaiPhong findLoaiPhongById(@Param("idLoaiPhong") Integer idLoaiPhong);

}
