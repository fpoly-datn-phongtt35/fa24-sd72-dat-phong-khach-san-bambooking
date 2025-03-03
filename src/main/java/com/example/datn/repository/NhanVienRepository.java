package com.example.datn.repository;

import com.example.datn.model.NhanVien;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NhanVienRepository extends JpaRepository<NhanVien, Integer> {
    @Query("""
                select nv
                from NhanVien nv
                where nv.ho like %:keyword%
                or nv.ten like %:keyword%
                or nv.gioiTinh like %:keyword%
                or nv.diaChi like %:keyword%
                or nv.sdt like %:keyword%
                """)

    Page<NhanVien> searchByName(@Param("keyword") String keyword, Pageable pageable);
    Optional<NhanVien> findBySdt(String sdt);

    @Query("FROM NhanVien WHERE taiKhoan.tenDangNhap = :username")
    Optional<NhanVien> findByUsername(String username);

    @Query("""
            SELECT nv.id
            FROM NhanVien nv
            JOIN TaiKhoan tk ON nv.taiKhoan.id = tk.id
            WHERE tk.tenDangNhap = :username
            """)
    Optional<Integer> findByIdEmployee(String username);


}

