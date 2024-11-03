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


    @Query("SELECT p FROM Phong p WHERE p.loaiPhong.id = :idLoaiPhong AND p.trangThai = true AND p.tinhTrang = 'available'")
    List<Phong> searchPhongKhaDung(@RequestParam("idLoaiPhong") Integer idLoaiPhong);

    @Query("SELECT p FROM Phong p WHERE p.id = :id")
    Phong getPhongById(@Param("id") Integer id);







    //
    Phong findById(int id);
}
