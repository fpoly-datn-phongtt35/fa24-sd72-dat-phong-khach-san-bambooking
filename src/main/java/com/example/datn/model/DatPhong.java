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

    @JoinColumn(name = "id_hoa_don")
    @ManyToOne
    private HoaDon hoaDon;

    @ManyToOne
    @JoinColumn(name = "id_khach_hang")
    private KhachHang khachHang;

    @Column(name = "ma_dat_phong")
    private String maDatPhong;
    @Column(name = "so_luong_phong")
    private Integer soLuongPhong;


    @Column(name = "thoi_gian_vao_du_kien")
    private LocalDateTime thoiGianVaoDuKien;
    @Column(name = "thoi_gian_ra_du_kien")
    private LocalDateTime thoiGianRaDuKien;

    @Column(name = "thoi_gian_dat")
    private LocalDateTime thoiGianDat;

    @Column(name = "ghi_chu")
    private String ghiChu;
    @Column(name = "trang_thai")
    private String trangThai;
}
