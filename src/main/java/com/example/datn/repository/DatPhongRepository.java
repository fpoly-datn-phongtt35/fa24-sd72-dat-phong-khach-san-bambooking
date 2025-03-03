package com.example.datn.repository;

import com.example.datn.dto.response.DatPhongResponse;
import com.example.datn.model.DatPhong;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface DatPhongRepository extends JpaRepository<DatPhong, Integer> {
    @Query("SELECT new com.example.datn.dto.response.DatPhongResponse(dp.id, dp.khachHang, " +
            "dp.maDatPhong,dp.soNguoi,dp.soPhong, dp.ngayDat , dp.tongTien, dp.ghiChu, dp.trangThai) " +
            "FROM DatPhong dp " +
            "WHERE (:trangThai IS NULL OR :trangThai = '' OR dp.trangThai = :trangThai) " +
            "ORDER BY dp.ngayDat DESC")
    Page<DatPhongResponse> DatPhongTheoTrangThai(@Param("trangThai") String trangThai, Pageable pageable);


    @Query("SELECT new com.example.datn.dto.response.DatPhongResponse(dp.id, dp.khachHang, " +
            "dp.maDatPhong,dp.soNguoi,dp.soPhong, dp.ngayDat , dp.tongTien, dp.ghiChu, dp.trangThai) " +
            " FROM DatPhong dp " +
            " WHERE dp.id = :id" +
            " ORDER BY dp.ngayDat DESC")
    DatPhongResponse findByIdDatPhong(@Param("id") Integer id);

    @Query("SELECT new com.example.datn.dto.response.DatPhongResponse(dp.id, dp.khachHang, " +
            "dp.maDatPhong,dp.soNguoi,dp.soPhong, dp.ngayDat , dp.tongTien, dp.ghiChu, dp.trangThai) " +
            " FROM DatPhong dp " +
            " WHERE dp.trangThai IN :trangThai" +
            " ORDER BY dp.ngayDat DESC")
    Page<DatPhongResponse> DatPhongTheoTrangThai(@Param("trangThai") List<String> trangThai, Pageable pageable);

    @Query("SELECT new com.example.datn.dto.response.DatPhongResponse(dp.id, dp.khachHang, " +
            "dp.maDatPhong,dp.soNguoi,dp.soPhong, dp.ngayDat , dp.tongTien, dp.ghiChu, dp.trangThai) " +
            " FROM DatPhong dp" +
            " ORDER BY dp.ngayDat DESC")
    Page<DatPhongResponse> findAllDP(Pageable pageable);


    @Query("SELECT new com.example.datn.dto.response.DatPhongResponse(dp.id, dp.khachHang, " +
            "dp.maDatPhong,dp.soNguoi,dp.soPhong, dp.ngayDat , dp.tongTien, dp.ghiChu, dp.trangThai) " +
            " FROM DatPhong dp " +
            " WHERE (:keyword IS NULL OR dp.trangThai LIKE %:keyword%" +
            " OR CONCAT(dp.khachHang.ho, ' ', dp.khachHang.ten) LIKE %:keyword%" +
            " OR dp.maDatPhong LIKE %:keyword%)" +
            " AND (:startDate IS NULL OR :endDate IS NULL OR dp.ngayDat BETWEEN :startDate AND :endDate)" +
            " ORDER BY dp.ngayDat DESC")
    Page<DatPhongResponse> searchDatPhong(
            @Param("keyword") String keyword,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            Pageable pageable);

    @Query(
            "Select dp from DatPhong dp where dp.maDatPhong= :maDatPhong"
    )
    DatPhong findByMaDatPhong(@Param("maDatPhong") String maDatPhong);

    @Query("SELECT new com.example.datn.dto.response.DatPhongResponse(" +
            "dp.id, dp.khachHang, " +
            "dp.maDatPhong,dp.soNguoi,dp.soPhong, dp.ngayDat , dp.tongTien, dp.ghiChu, dp.trangThai) " +
            " FROM DatPhong dp " +
            " WHERE (:keyword IS NULL OR dp.trangThai LIKE %:keyword%" +
            " OR CONCAT(dp.khachHang.ho, ' ', dp.khachHang.ten) LIKE %:keyword%" +
            " OR dp.maDatPhong LIKE %:keyword%)" +
            " ORDER BY dp.ngayDat DESC")
    Page<DatPhongResponse> findAll(@Param("keyword") String keyword, Pageable pageable);

    @Query(
            "Select dp from DatPhong dp where dp.khachHang.id = :idKhachHang"
    )
    List<DatPhong> findByIdKhachHang(@Param("idKhachHang") Integer idKhachHang);

    @Query("SELECT new com.example.datn.dto.response.DatPhongResponse(dp.id, dp.khachHang, " +
            "dp.maDatPhong,dp.soNguoi,dp.soPhong, dp.ngayDat , dp.tongTien, dp.ghiChu, dp.trangThai) " +
            "FROM DatPhong dp " +
            "ORDER BY dp.ngayDat DESC")
    Page<DatPhong> DSDatPhong(Pageable pageable);

    @Query(value = "SELECT dp.id " +
            "FROM tra_phong tp " +
            "JOIN xep_phong xp ON tp.id_xep_phong = xp.id " +
            "JOIN thong_tin_dat_phong ttdp ON xp.id_thong_tin_dat_phong = ttdp.id " +
            "JOIN dat_phong dp ON ttdp.id_dat_phong = dp.id " +
            "WHERE tp.id = :idTraPhong", nativeQuery = true)
    Integer findIdDatPhongByIdTraPhong(@Param("idTraPhong") Integer idTraPhong);
}

