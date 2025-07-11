package com.example.datn.repository;

import com.example.datn.model.LoaiPhong;
import com.example.datn.model.Phong;
import com.example.datn.model.ThongTinDatPhong;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;


@Repository
public interface PhongRepository extends JpaRepository<Phong, Integer> {
    @Query("""
            select p
            from Phong p
            where p.maPhong like %:keyword%
            or p.tenPhong like %:keyword%
            or p.loaiPhong.tenLoaiPhong like %:keyword%
            or p.tinhTrang like %:keyword%
            or p.trangThai = TRUE
            """)
    Page<Phong> search(@Param("keyword") String keyword, Pageable pageable);


    @Query("""
    SELECT p 
    FROM Phong p 
    WHERE p.loaiPhong.id = :idLoaiPhong 
      AND p.trangThai = true 
      AND p.tinhTrang in (:tinhTrang)
      AND NOT EXISTS (
          SELECT d 
          FROM XepPhong d 
          JOIN d.thongTinDatPhong ttdp
          WHERE d.phong = p     
            AND :ngayNhanPhong <= d.ngayTraPhong
            AND :ngayTraPhong >= d.ngayNhanPhong
            AND ttdp.trangThai IN (:trangThaiTTDP)
      )
""")
    List<Phong> searchPhongKhaDung(
            @Param("idLoaiPhong") Integer idLoaiPhong,
            @Param("ngayNhanPhong") LocalDateTime ngayNhanPhong,
            @Param("ngayTraPhong") LocalDateTime ngayTraPhong,
            List<String> trangThaiTTDP,
            List<String> tinhTrang
    );


    @Query("SELECT p FROM Phong p WHERE p.id = :id")
    Phong getPhongById(@Param("id") Integer id);

    //
    Phong findById(int id);

    @Query("""
            select p
            from Phong p
            where p.maPhong like %:keyword%
            or p.tenPhong like %:keyword%
            or p.loaiPhong.tenLoaiPhong like %:keyword%
            or p.tinhTrang like %:keyword%
            or p.trangThai = TRUE
            """)
    List<Phong> DSPhong(@Param("keyword") String keyword);

    List<Phong> findByTinhTrang(String tinhTrang);
}
