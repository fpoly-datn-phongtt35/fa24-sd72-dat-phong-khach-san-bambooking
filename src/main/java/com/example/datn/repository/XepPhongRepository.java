package com.example.datn.repository;

import com.example.datn.model.ThongTinDatPhong;
import com.example.datn.model.XepPhong;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface XepPhongRepository extends JpaRepository<XepPhong,Integer> {
    @Query("select xp from XepPhong xp join ThongTinDatPhong ttdp on xp.thongTinDatPhong.id = ttdp.id" +
            "  where xp.thongTinDatPhong.maThongTinDatPhong =:maTTDP")
    XepPhong getByMaTTDP(String maTTDP);

    @Query("select xp from XepPhong xp" +
            "  where xp.trangThai =true and xp.thongTinDatPhong.trangThai IN ('Dang o', 'Den han') and xp.phong.id =:idPhong")
    XepPhong getByIDPhong(int idPhong);

    @Query("SELECT xp FROM XepPhong xp " +
            "WHERE (xp.thongTinDatPhong.datPhong.maDatPhong = :key " +
            "OR xp.thongTinDatPhong.maThongTinDatPhong = :key " +
            "OR xp.phong.maPhong = :key " +
            "OR xp.thongTinDatPhong.datPhong.khachHang.sdt = :key) " +
            "AND xp.thongTinDatPhong.trangThai IN ('Dang o', 'Den han')")
    List<XepPhong> findByKey(@Param("key") String key);


}
