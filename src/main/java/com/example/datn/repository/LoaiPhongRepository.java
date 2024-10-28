package com.example.datn.repository;

import com.example.datn.dto.response.LoaiPhongResponse;
import com.example.datn.dto.response.TienIchResponse;
import com.example.datn.model.LoaiPhong;
import com.example.datn.model.TienIch;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

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
            "WHERE (:tenLoaiPhong IS NULL OR lp.tenLoaiPhong LIKE %:tenLoaiPhong%)\n" +
            "    AND (:dienTichMin IS NULL OR lp.dienTich >= :dienTichMin)\n" +
            "    AND (:dienTichMax IS NULL OR lp.dienTich <= :dienTichMax )\n" +
            "    AND (:soKhach IS NULL OR lp.soKhachToiDa >= :soKhach)\n" +
            "    AND (:donGiaMin IS NULL OR lp.donGia >= :donGiaMin)\n" +
            "    AND (:donGiaMax IS NULL OR lp.donGia <= :donGiaMax)\n" +
            "    AND (:donGiaPhuThuMin IS NULL OR lp.donGiaPhuThu >=:donGiaPhuThuMin)\n" +
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

    @Query("SELECT new com.example.datn.dto.response.LoaiPhongResponse(lp.id, lp.tenLoaiPhong, lp.dienTich," +
            " lp.soKhachToiDa, lp.donGia, lp.donGiaPhuThu,lp.moTa) FROM LoaiPhong lp " +
            "WHERE EXISTS (" +
            "   SELECT p FROM Phong p " +
            "   LEFT JOIN XepPhong xp ON p.id = xp.phong.id " +
            "   WHERE p.loaiPhong.id = lp.id " +
            "   AND p.trangThai = true " +
            "   AND (xp.id IS NULL OR (xp.ngayTraPhong < :ngayNhanPhong OR xp.ngayNhanPhong > :ngayTraPhong))" +  // Không trùng lịch
            ")")
    Page<LoaiPhongResponse> LoaiPhongKhaDung(@Param("ngayNhanPhong") LocalDateTime ngayNhanPhong,
                                             @Param("ngayTraPhong") LocalDateTime ngayTraPhong,Pageable pageable);

}
