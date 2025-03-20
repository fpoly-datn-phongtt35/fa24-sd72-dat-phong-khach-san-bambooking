package com.example.datn.repository;

import com.example.datn.model.KiemTraVatTu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface KiemTraVatTuRepository extends JpaRepository<KiemTraVatTu, Integer> {

    List<KiemTraVatTu> findByKiemTraPhong_XepPhongIdAndTinhTrangIn(Integer xepPhongId, List<String> tinhTrang);

    @Query(value = """
                SELECT 
                    p.ten_phong,
                    vt.ten_vat_tu,
                    vt.gia,
                    (vtlp.so_luong - ktvt.so_luong) AS so_luong_thieu,
                    tthd.tien_khau_tru
                FROM thong_tin_hoa_don tthd
                JOIN tra_phong tp ON tthd.id_tra_phong = tp.id
                JOIN xep_phong xp ON xp.id = tp.id_xep_phong
                JOIN phong p ON p.id = xp.id_phong
                JOIN kiem_tra_phong ktp ON ktp.id_xep_phong = xp.id
                JOIN kiem_tra_vat_tu ktvt ON ktvt.id_kiem_tra_phong = ktp.id
                JOIN loai_phong lp ON lp.id = p.id_loai_phong
                JOIN vat_tu_loai_phong vtlp ON vtlp.id_loai_phong = lp.id AND vtlp.id_vat_tu = ktvt.id_vat_tu
                JOIN vat_tu vt ON vt.id = vtlp.id_vat_tu
                WHERE tthd.id_hoa_don = :idHoaDon
                AND ktvt.tinh_trang IN :tinhTrang
            """, nativeQuery = true)
    List<Object[]> findByIdHoaDonAndTinhTrangIn(
            @Param("idHoaDon") Integer idHoaDon,
            @Param("tinhTrang") List<String> tinhTrang
    );
}
