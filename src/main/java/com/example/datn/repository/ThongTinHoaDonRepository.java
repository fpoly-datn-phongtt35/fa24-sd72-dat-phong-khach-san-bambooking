package com.example.datn.repository;

import com.example.datn.model.ThongTinHoaDon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ThongTinHoaDonRepository extends JpaRepository<ThongTinHoaDon, Integer> {

    List<ThongTinHoaDon> findByHoaDonId(Integer idHoaDon);

    @Query("SELECT COALESCE(SUM(t.tienKhauTru), 0) FROM ThongTinHoaDon t WHERE t.hoaDon.id = :idHoaDon")
    Double tinhTongTienKhauTru(@Param("idHoaDon") Integer idHoaDon);

    @Query("SELECT COALESCE(SUM(t.tienPhong + t.tienPhuThu + t.tienDichVu), 0) FROM ThongTinHoaDon t WHERE t.hoaDon.id = :idHoaDon")
    Double tinhTongTienGoc(@Param("idHoaDon") Integer idHoaDon);

}
