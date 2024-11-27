package com.example.datn.repository;

import com.example.datn.model.KhachHangCheckin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface KhachHangCheckinRepository extends JpaRepository<KhachHangCheckin,Integer> {
    @Query("Select checkin from KhachHangCheckin checkin " +
            "Where checkin.thongTinDatPhong.maThongTinDatPhong =:maThongTinDatPhong")
    List<KhachHangCheckin> findsByMaTTDP(String maThongTinDatPhong);
}
