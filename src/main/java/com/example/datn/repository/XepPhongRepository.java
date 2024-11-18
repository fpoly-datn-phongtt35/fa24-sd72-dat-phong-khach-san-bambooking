package com.example.datn.repository;

import com.example.datn.model.XepPhong;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface XepPhongRepository extends JpaRepository<XepPhong,Integer> {
    @Query("select xp from XepPhong xp join ThongTinDatPhong ttdp on xp.thongTinDatPhong.id = ttdp.id" +
            "  where xp.thongTinDatPhong.maThongTinDatPhong =:maTTDP")
    XepPhong getByMaTTDP(String maTTDP);

    @Query("select xp from XepPhong xp" +
            "  where xp.trangThai =true and xp.thongTinDatPhong.trangThai ='Dang o' and xp.phong.id =:idPhong")
    XepPhong getByIDPhong(int idPhong);

}
