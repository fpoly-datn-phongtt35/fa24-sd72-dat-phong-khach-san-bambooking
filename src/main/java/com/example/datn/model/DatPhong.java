package com.example.datn.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "dat_phong")
public class DatPhong {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @JoinColumn(name = "id_nhan_vien")
    @ManyToOne
    private NhanVien nhanVien;

    @ManyToOne
    @JoinColumn(name = "id_khach_hang")
    private KhachHang khachHang;

    @Column(name = "ma_dat_phong")
    private String maDatPhong;

    @Column(name = "ngay_dat")
    private LocalDateTime ngayDat;

    @Column(name = "ghi_chu")
    private String ghiChu;
    @Column(name = "trang_thai")
    private String trangThai;
}
