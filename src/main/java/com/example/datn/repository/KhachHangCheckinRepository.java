package com.example.datn.repository;

import com.example.datn.model.KhachHangCheckin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface KhachHangCheckinRepository extends JpaRepository<KhachHangCheckin,Integer> {
    @Query("Select checkin from KhachHangCheckin checkin " +
            "Where checkin.thongTinDatPhong.maThongTinDatPhong =:maThongTinDatPhong")
    List<KhachHangCheckin> findsByMaTTDP(String maThongTinDatPhong);


    @Query( "SELECT checkin,xp.phong.maPhong FROM KhachHangCheckin checkin " +
            "JOIN KhachHang kh ON kh.id = checkin.khachHang.id " +
            "JOIN XepPhong xp ON xp.thongTinDatPhong.id = checkin.thongTinDatPhong.id " +
            "WHERE (:keyword IS NULL OR :keyword = '' OR " +
            "xp.phong.maPhong = :keyword OR " +
            "kh.ten = :keyword OR " +
            "CONCAT(kh.ho, ' ', kh.ten) like %:keyword% OR " +
            "kh.sdt = :keyword OR " +
            "kh.cmnd = :keyword OR " +
            "xp.phong.tenPhong = :keyword) "+
            "AND checkin.trangThai = true " +
            "ORDER BY xp.phong.maPhong ASC")
    List<Object[]> findKhachHangCheckin(@Param("keyword") String keyword);

    @Query("SELECT checkin FROM KhachHangCheckin checkin " +
           "WHERE checkin.thongTinDatPhong.trangThai IN (:trangthaiTTDP)")
    List<KhachHangCheckin> findByTrangThaiTTDP(List<String> trangthaiTTDP);
}
