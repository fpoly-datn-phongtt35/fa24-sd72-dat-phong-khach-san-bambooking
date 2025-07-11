package com.example.datn.repository;

import com.example.datn.dto.response.TTDPResponse;
import com.example.datn.model.DatPhong;
import com.example.datn.model.ThongTinDatPhong;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ThongTinDatPhongRepository extends JpaRepository<ThongTinDatPhong, Integer> {
    @Query("SELECT t FROM ThongTinDatPhong t WHERE t.datPhong.id = :iddp and t.trangThai IN (:trangThai)")
    List<ThongTinDatPhong> findByDatPhongId(@Param("iddp") Integer iddp, @Param("trangThai") List<String> trangThai);


    @Query(
            "select new com.example.datn.dto.response.TTDPResponse(ttdp.id, ttdp.datPhong.maDatPhong, ttdp.maThongTinDatPhong, " +
                    "CONCAT(ttdp.datPhong.khachHang.ho ,' ', ttdp.datPhong.khachHang.ten), ttdp.soNguoi,ttdp.soTre, ttdp.loaiPhong, ttdp.ngayNhanPhong, ttdp.ngayTraPhong, " +
                    "ttdp.giaDat,ttdp.ghiChu,ttdp.trangThai) " +
                    "from ThongTinDatPhong ttdp " +
                    "where ttdp.trangThai = :trangThai " +
                    "order by ttdp.datPhong.ngayDat")
    Page<TTDPResponse> HienThiQuanLy(@Param("trangThai") String trangThai, Pageable pageable);

    @Query(
            "SELECT ttdp FROM ThongTinDatPhong ttdp WHERE ttdp.datPhong.maDatPhong = :maDatPhong"
    )
    List<ThongTinDatPhong> findByMaDatPhong(@Param("maDatPhong") String maDatPhong);

    @Query("SELECT new com.example.datn.dto.response.TTDPResponse(ttdp.id, ttdp.datPhong.maDatPhong, ttdp.maThongTinDatPhong," +
            " CONCAT(dp.khachHang.ho ,' ', dp.khachHang.ten), ttdp.soNguoi,ttdp.soTre, ttdp.loaiPhong, ttdp.ngayNhanPhong, ttdp.ngayTraPhong," +
            " ttdp.giaDat, ttdp.ghiChu, ttdp.trangThai) " +
            "FROM ThongTinDatPhong ttdp " +
            "JOIN ttdp.loaiPhong lp " +
            "JOIN ttdp.datPhong dp " +
            "JOIN ttdp.datPhong.khachHang kh " +
            "WHERE (:startDate IS NULL OR ttdp.ngayNhanPhong >= :startDate) " +
            "AND (:endDate IS NULL OR ttdp.ngayTraPhong <= :endDate) " +
            "AND (:trangThai IS NULL OR ttdp.trangThai LIKE %:trangThai%) " +
            "AND (:key IS NULL OR (ttdp.maThongTinDatPhong LIKE %:key% " +
            "OR lp.tenLoaiPhong LIKE %:key% " +
            "OR dp.maDatPhong LIKE %:key% " +
            "OR CONCAT(kh.ho, ' ', kh.ten) LIKE %:key% " +
            "OR kh.sdt LIKE %:key% " +
            "OR kh.email LIKE %:key%))" +
            "ORDER BY dp.ngayDat DESC")
    Page<TTDPResponse> findByDateRangeAndKey(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("key") String key,
            @Param("trangThai") String trangThai,
            Pageable pageable);


    @Query("SELECT t FROM ThongTinDatPhong t WHERE t.id = :id")
    ThongTinDatPhong getTTDPById(@Param("id") Integer id);

    @Query("SELECT ttdp FROM ThongTinDatPhong ttdp WHERE ttdp.maThongTinDatPhong = :maTTDP")
    ThongTinDatPhong getTTDPByMa(@Param("maTTDP") String maTTDP);


    @Query("SELECT ttdp FROM ThongTinDatPhong ttdp WHERE ttdp.datPhong.id = :idDatPhong")
    List<ThongTinDatPhong> findByIDDatPhong(@Param("idDatPhong") Integer idDatPhong);

    @Query(""" 
            SELECT dp FROM  DatPhong dp 
            join KhachHang kh on dp.khachHang.id = kh.id
            join TaiKhoan tk on kh.taiKhoan.id = tk.id
            Inner JOIN ThongTinDatPhong ttdp on dp.id= ttdp.datPhong.id
            WHERE tk.tenDangNhap = :tenDangNhap
            AND (:keyword IS NULL OR dp.maDatPhong LIKE %:keyword%)
            AND (:ngayNhanPhong IS NULL OR ttdp.ngayNhanPhong >= :ngayNhanPhong)
            AND (:ngayTraPhong IS NULL OR ttdp.ngayTraPhong <= :ngayTraPhong)
            ORDER BY dp.id DESC
            """)
    List<DatPhong> getDPbyTenDangNhap(@Param("tenDangNhap") String tenDangNhap,
                                      @Param("keyword") String keyword,
                                      @Param("ngayNhanPhong") LocalDate ngayNhanPhong,
                                      @Param("ngayTraPhong") LocalDate ngayTraPhong);

    @Query("SELECT t FROM ThongTinDatPhong t WHERE t.datPhong.id = :iddp ")
    List<ThongTinDatPhong> getAllByidDatPhong(@Param("iddp") Integer iddp);


    @Query("SELECT t FROM ThongTinDatPhong t WHERE t.datPhong.id = :iddp and t.loaiPhong.id= :idlp")
    List<ThongTinDatPhong> getByidDPandidLP(@Param("iddp") Integer iddp, @Param("idlp") Integer idlp);

    @Query("SELECT ttdp FROM ThongTinDatPhong ttdp WHERE ttdp.datPhong.id = :idDatPhong AND ttdp.trangThai IN :trangThai")
    List<ThongTinDatPhong> findByIDDatPhongandTT(Integer idDatPhong, List<String> trangThai);

    List<ThongTinDatPhong> findByDatPhong_Id(Integer datPhongId);

    List<ThongTinDatPhong> findByDatPhong(DatPhong datPhong);
}

