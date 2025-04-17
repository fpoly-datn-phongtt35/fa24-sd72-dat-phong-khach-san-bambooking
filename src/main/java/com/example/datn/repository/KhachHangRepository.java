package com.example.datn.repository;

import com.example.datn.model.KhachHang;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface KhachHangRepository extends JpaRepository<KhachHang,Integer> {

    @Query("""
    SELECT kh
    FROM KhachHang kh
    WHERE (:trangThai IS NULL OR kh.trangThai = :trangThai)
    AND (:keyword IS NULL OR 
        kh.ho LIKE CONCAT('%', :keyword, '%')
        OR kh.ten LIKE CONCAT('%', :keyword, '%')
        OR CONCAT(kh.ho, ' ', kh.ten) LIKE CONCAT('%', :keyword, '%')
        OR kh.cmnd LIKE CONCAT('%', :keyword, '%')
        OR kh.sdt LIKE CONCAT('%', :keyword, '%')
        OR kh.email LIKE CONCAT('%', :keyword, '%')
        OR kh.gioiTinh LIKE CONCAT('%', :keyword, '%')
        OR kh.diaChi LIKE CONCAT('%', :keyword, '%'))
""")
    Page<KhachHang> search(
            @Param("trangThai") Boolean trangThai,
            @Param("keyword") String keyword,
            Pageable pageable
    );

    @Query("SELECT kh FROM KhachHang kh WHERE kh.taiKhoan.tenDangNhap = :userName")
    KhachHang getKHByUsername(@Param("userName") String userName);

    Optional<KhachHang> findByEmail(String email);

}
