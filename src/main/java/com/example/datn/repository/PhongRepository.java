package com.example.datn.repository;

import com.example.datn.model.Phong;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PhongRepository extends JpaRepository<Phong, Integer> {
    @Query("""
            select p
            from Phong p
            where p.maPhong like %:keyword%
            or p.tenPhong like %:keyword%
            or p.loaiPhong.tenLoaiPhong like %:keyword%
            or p.tinhTrang like %:keyword%
            or p.trangThai like %:keyword%
            """)
    Page<Phong> search(@Param("keyword") String keyword, Pageable pageable);
}
