package com.example.datn.repository;

import com.example.datn.dto.response.DatPhongResponse;
import com.example.datn.model.DatPhong;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface DatPhongRepository extends JpaRepository<DatPhong, Integer> {
    @Query("SELECT new com.example.datn.dto.response.DatPhongResponse(dp.id, dp.khachHang, " +
            "dp.maDatPhong,dp.soNguoi,dp.soTre,dp.soPhong, dp.ngayDat , dp.tongTien, dp.ghiChu, dp.trangThai) " +
            "FROM DatPhong dp " +
            "WHERE (:trangThai IS NULL OR :trangThai = '' OR dp.trangThai = :trangThai) " +
            "ORDER BY dp.ngayDat DESC")
    Page<DatPhongResponse> DatPhongTheoTrangThai(@Param("trangThai") String trangThai, Pageable pageable);


    @Query("SELECT new com.example.datn.dto.response.DatPhongResponse(dp.id, dp.khachHang, " +
            "dp.maDatPhong,dp.soNguoi,dp.soTre,dp.soPhong, dp.ngayDat , dp.tongTien, dp.ghiChu, dp.trangThai) " +
            " FROM DatPhong dp " +
            " WHERE dp.id = :id" +
            " ORDER BY dp.ngayDat DESC")
    DatPhongResponse findByIdDatPhong(@Param("id") Integer id);

    @Query("SELECT DISTINCT new com.example.datn.dto.response.DatPhongResponse(dp.id, dp.khachHang, " +
            "dp.maDatPhong, dp.soNguoi,dp.soTre, dp.soPhong, dp.ngayDat, dp.tongTien, dp.ghiChu, dp.trangThai) " +
            "FROM ThongTinDatPhong ttdp " +
            "JOIN ttdp.datPhong dp " +
            "WHERE dp.trangThai IN (:trangThai) " +
            "AND (:key IS NULL OR :key = '' OR dp.maDatPhong LIKE %:key% OR dp.khachHang.ho LIKE %:key% OR dp.khachHang.ten LIKE %:key% OR dp.khachHang.sdt LIKE %:key% " +
            "OR CONCAT(dp.khachHang.ho, ' ' ,dp.khachHang.ten) LIKE :key OR ttdp.maThongTinDatPhong LIKE %:key%)" +
            "AND ttdp.trangThai IN (:trangThaiTTDP) " +
            "AND ttdp.ngayNhanPhong = :ngayNhanPhong " +
            "AND (:ngayTraPhong IS NULL OR ttdp.ngayTraPhong <= :ngayTraPhong)" +
            "ORDER BY dp.ngayDat DESC")
    Page<DatPhongResponse> DatPhongTheoTrangThai(
            @Param("trangThai") List<String> trangThai,
            @Param("trangThaiTTDP") List<String> trangThaiTTDP,
            @Param("key") String key,
            @Param("ngayNhanPhong") LocalDate ngayNhanPhong,
            @Param("ngayTraPhong") LocalDate ngayTraPhong,
            Pageable pageable);

    @Query("SELECT DISTINCT new com.example.datn.dto.response.DatPhongResponse(dp.id, dp.khachHang, dp.maDatPhong, dp.soNguoi,dp.soTre, dp.soPhong, dp.ngayDat, dp.tongTien, dp.ghiChu, dp.trangThai) " +
            "FROM DatPhong dp " +
            "WHERE EXISTS (" +
            "   SELECT 1 " +
            "   FROM ThongTinDatPhong ttdp " +
            "   WHERE ttdp.datPhong = dp " +
            "   AND ttdp.trangThai IN (:trangThaiTTDP) " +
            "   OR (:ngayNhanPhong IS NULL OR ttdp.ngayNhanPhong >= :ngayNhanPhong) " +
            "   OR (:ngayTraPhong IS NULL OR ttdp.ngayTraPhong <= :ngayTraPhong) " +
            "   OR (:key IS NULL OR LOWER(ttdp.maThongTinDatPhong) LIKE LOWER(CONCAT('%', :key, '%')))" +
            ") " +
            "AND dp.trangThai IN (:trangThai) " +
            "AND (" +
            "   :key IS NULL OR " +
            "   LOWER(dp.maDatPhong) LIKE LOWER(CONCAT('%', :key, '%')) OR " +
            "   LOWER(dp.khachHang.ho) LIKE LOWER(CONCAT('%', :key, '%')) OR " +
            "   LOWER(dp.khachHang.ten) LIKE LOWER(CONCAT('%', :key, '%')) OR " +
            "   LOWER(dp.khachHang.sdt) LIKE LOWER(CONCAT('%', :key, '%')) OR " +
            "   LOWER(CONCAT(dp.khachHang.ho, ' ', dp.khachHang.ten)) LIKE LOWER(CONCAT('%', :key, '%'))" +
            ") " +
            "ORDER BY dp.id DESC")
    Page<DatPhongResponse> findDatPhong(
            @Param("trangThai") List<String> trangThai,
            @Param("trangThaiTTDP") List<String> trangThaiTTDP,
            @Param("key") String key,
            @Param("ngayNhanPhong") LocalDate ngayNhanPhong,
            @Param("ngayTraPhong") LocalDate ngayTraPhong,
            Pageable pageable);

    @Query("SELECT dp FROM DatPhong dp " +
            "WHERE dp.trangThai IN :trangThai " +
            "ORDER BY dp.id DESC")
    List<DatPhong> findDatPhongByTrangThais(
            @Param("trangThai") List<String> trangThai);

    @Query("SELECT new com.example.datn.dto.response.DatPhongResponse(dp.id, dp.khachHang, " +
            "dp.maDatPhong,dp.soNguoi,dp.soTre,dp.soPhong, dp.ngayDat , dp.tongTien, dp.ghiChu, dp.trangThai) " +
            " FROM DatPhong dp" +
            " ORDER BY dp.ngayDat DESC")
    Page<DatPhongResponse> findAllDP(Pageable pageable);


    @Query("SELECT new com.example.datn.dto.response.DatPhongResponse(dp.id, dp.khachHang, " +
            "dp.maDatPhong,dp.soNguoi,dp.soTre,dp.soPhong, dp.ngayDat , dp.tongTien, dp.ghiChu, dp.trangThai) " +
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
            "dp.id, dp.khachHang," +
            "dp.maDatPhong, dp.soNguoi,dp.soTre, dp.soPhong, dp.ngayDat, dp.tongTien, dp.ghiChu, dp.trangThai) " +
            "FROM DatPhong dp " +
            "WHERE (:keyword IS NULL OR dp.trangThai LIKE :keyword " +
            "OR CONCAT(dp.khachHang.ho, ' ', dp.khachHang.ten) LIKE :keyword " +
            "OR dp.maDatPhong LIKE :keyword " +
            "OR dp.khachHang.sdt LIKE :keyword " +
            "OR dp.khachHang.email LIKE :keyword) " +
            "ORDER BY dp.ngayDat DESC")
    Page<DatPhongResponse> findAll(@Param("keyword") String keyword, Pageable pageable);

    @Query(
            "Select dp from DatPhong dp where dp.khachHang.id = :idKhachHang"
    )
    List<DatPhong> findByIdKhachHang(@Param("idKhachHang") Integer idKhachHang);

    @Query("SELECT new com.example.datn.dto.response.DatPhongResponse(dp.id, dp.khachHang, " +
            "dp.maDatPhong,dp.soNguoi,dp.soTre,dp.soPhong, dp.ngayDat , dp.tongTien, dp.ghiChu, dp.trangThai) " +
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

    // Trong DatPhongRepository.java
    @Query("SELECT kh.email FROM DatPhong dp JOIN dp.khachHang kh WHERE dp.id = :idTraPhong")
    String findEmailByTraPhongId(@Param("idTraPhong") Integer idTraPhong);

    @Query("SELECT dp FROM DatPhong dp WHERE dp.khachHang.email = :keyword or dp.khachHang.sdt = :keyword " +
            "ORDER BY dp.id DESC")
    List<DatPhong> getLichSuDPbyEmail(@Param("keyword") String keyword);

    @Query("Select dp from DatPhong dp where dp.id = :iddp AND dp.trangThai = :trangThai")
    DatPhong findByIDDPandTT(@Param("iddp") Integer iddp,String trangThai);

    Page<DatPhong> findByTrangThaiAndMaDatPhongContainingIgnoreCase(String trangThai, String maDatPhong, Pageable pageable);
}

