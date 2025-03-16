package com.example.datn.repository;

import com.example.datn.model.DichVuDiKem;
import com.example.datn.model.Phong;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ViewPhongRepository extends JpaRepository<Phong, Integer> {
    @Query("""
            SELECT p
            FROM Phong p
            LEFT JOIN p.hinhAnhs ha
            WHERE (:tinhTrang IS NULL OR p.tinhTrang = :tinhTrang)
            AND (:keyword IS NULL OR :keyword = '' OR p.tenPhong LIKE %:keyword%)
            AND (p.loaiPhong.id IN (:idLoaiPhong) OR :idLoaiPhong IS NULL)
            AND (:giaMin IS NULL OR p.loaiPhong.donGia >= :giaMin)
            AND (:giaMax IS NULL OR p.loaiPhong.donGia <= :giaMax)
            AND (:soTang IS NULL OR p.maPhong LIKE CONCAT('P', :soTang, '%'))
           
            """)
    List<Phong> findByCriteria(
            @Param("tinhTrang") String tinhTrang,
            @Param("keyword") String keyword,
            @Param("idLoaiPhong") List<Integer> idLoaiPhong,
            @Param("giaMin") Integer giaMin,
            @Param("giaMax") Integer giaMax,
            @Param("soTang") Integer soTang
    );

    @Query("""
            SELECT
                dvdk
            FROM XepPhong xp 
            JOIN Phong p ON xp.phong.id = p.id
            JOIN DichVuDiKem dvdk ON p.loaiPhong.id = dvdk.loaiPhong.id
            WHERE xp.id = :idXepPhong
            
            """)
    List<DichVuDiKem> getDVDK(int idXepPhong);


}
