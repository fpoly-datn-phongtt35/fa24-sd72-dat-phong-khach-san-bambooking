package com.example.datn.repository;

import com.example.datn.dto.response.DatPhongResponse;
import com.example.datn.model.DatPhong;
import com.example.datn.utilities.DateTimeFormat;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface DatPhongRepository extends JpaRepository<DatPhong, Integer> {
    @Query("SELECT new com.example.datn.dto.response.DatPhongResponse(dp.id," +
            " CONCAT(dp.nhanVien.ho, ' ', dp.nhanVien.ten), " +
            "CONCAT(dp.khachHang.ho, ' ', dp.khachHang.ten), dp.maDatPhong," +
            "dp.ngayDat, dp.ghiChu, dp.trangThai) " +
            "FROM DatPhong dp " +
            "WHERE (:trangThai IS NULL OR :trangThai = '' OR dp.trangThai = :trangThai)")
    Page<DatPhongResponse> DatPhongTheoTrangThai(@Param("trangThai") String trangThai, Pageable pageable);
}

