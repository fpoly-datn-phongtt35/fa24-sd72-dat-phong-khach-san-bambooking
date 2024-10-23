package com.example.datn.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "nhan_vien")
public class ThongTinNhanVien {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ho")
    private String ho;

    @Column(name = "ten")
    private String ten;

    @Column(name = "gioi_tinh")
    private String gioiTinh;

    @Column(name = "dia_chi")
    private String diaChi;

    @Column(name = "sdt")
    private String sdt;

    @Column(name = "email")
    private String email;

    // Liên kết với TaiKhoan
    @OneToOne
    @JoinColumn(name = "id_tai_khoan", referencedColumnName = "id")
    private TaiKhoan taiKhoan;
}