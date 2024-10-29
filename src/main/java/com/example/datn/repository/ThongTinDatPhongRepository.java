package com.example.datn.repository;

import com.example.datn.dto.response.TTDPResponse;
import com.example.datn.model.ThongTinDatPhong;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ThongTinDatPhongRepository extends JpaRepository<ThongTinDatPhong, Integer> {
    @Query("SELECT t FROM ThongTinDatPhong t WHERE t.datPhong.id = :iddp")
    List<ThongTinDatPhong> findByDatPhongId(@Param("iddp") Integer iddp);


    @Query(
            "select new com.example.datn.dto.response.TTDPResponse(ttdp.id, ttdp.datPhong.maDatPhong, ttdp.maThongTinDatPhong, " +
                    "CONCAT(ttdp.datPhong.khachHang.ho ,' ', ttdp.datPhong.khachHang.ten), ttdp.soNguoi, ttdp.loaiPhong.tenLoaiPhong, ttdp.ngayNhanPhong, ttdp.ngayTraPhong, " +
                    "ttdp.giaDat) " +
                    "from ThongTinDatPhong ttdp " +
                    "where ttdp.trangThai = :trangThai")
    Page<TTDPResponse> HienThiQuanLy(@Param("trangThai") String trangThai, Pageable pageable);

    @Query(
            "SELECT ttdp FROM ThongTinDatPhong ttdp WHERE ttdp.datPhong.maDatPhong = :maDatPhong"
    )
    List<ThongTinDatPhong> findByMaDatPhong(@Param("maDatPhong") String maDatPhong);

}

