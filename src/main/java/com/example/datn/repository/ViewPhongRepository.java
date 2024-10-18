package com.example.datn.repository;

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
            AND (:giaMin IS NULL OR p.giaPhong >= :giaMin)
            AND (:giaMax IS NULL OR p.giaPhong <= :giaMax)
            AND (:keyword IS NULL OR :keyword = '' OR p.tenPhong LIKE %:keyword%)
            """)
    List<Phong> findByCriteria(
            @Param("tinhTrang") String tinhTrang,
            @Param("giaMin") Double giaMin,
            @Param("giaMax") Double giaMax,
            @Param("keyword") String keyword
    );


}
