package com.example.datn.repository;

import com.example.datn.model.HoaDon;
import com.example.datn.model.NhanVien;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface HoaDonRepository extends JpaRepository<HoaDon, Integer> {
    @Query("""
        SELECT hd FROM HoaDon hd
        WHERE (:trangThai IS NULL OR hd.trangThai = :trangThai)
        AND (:keyword IS NULL OR (
            hd.maHoaDon LIKE %:keyword%
            OR CONCAT(hd.nhanVien.ho, ' ', hd.nhanVien.ten) LIKE %:keyword%
            OR hd.datPhong.maDatPhong LIKE %:keyword%))
        """)
    Page<HoaDon> findByTrangThai(
            @Param("trangThai") String trangThai,
            @Param("keyword") String keyword,
            Pageable pageable
    );


    boolean existsByMaHoaDon(String maHoaDon);

    @Query("""
                SELECT nv FROM NhanVien nv
                JOIN nv.taiKhoan tk
                WHERE tk.tenDangNhap = :tenDangNhap
            """)
    NhanVien searchTenDangNhap(String tenDangNhap);
}
