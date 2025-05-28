package com.example.datn.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "loai_phong")
public class LoaiPhong {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "ten_loai_phong")
    private String tenLoaiPhong;

    @Column(name = "ma_loai_phong")
    private String maLoaiPhong;

    @Column(name = "dien_tich")
    private Integer dienTich;

    @Column(name = "so_khach_tieu_chuan")
    private Integer soKhachTieuChuan;
    @Column(name = "so_khach_toi_da")
    private Integer soKhachToiDa;
    @Column(name = "tre_em_tieu_chuan")
    private Integer treEmTieuChuan;
    @Column(name = "tre_em_toi_da")
    private Integer treEmToiDa;

    @Column(name = "don_gia")
    private Double donGia;

    @Column(name = "phu_thu_nguoi_lon")
    private Double phuThuNguoiLon;
    @Column(name = "phu_thu_tre_em")
    private Double phuThuTreEm;
    @Column(name = "mo_ta")
    private String moTa;

    @Column(name = "trang_thai")
    private Boolean trangThai;
}
