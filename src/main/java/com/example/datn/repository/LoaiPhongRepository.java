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
            "WHERE lp.tenLoaiPhong LIKE %:tenLoaiPhong% "
    )
    Page<LoaiPhong> search(@Param("tenLoaiPhong") String keyword, Pageable pageable);

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
