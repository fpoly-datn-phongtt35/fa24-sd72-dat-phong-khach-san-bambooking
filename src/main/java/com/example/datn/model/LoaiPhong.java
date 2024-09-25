package com.example.datn.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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

    @Column(name = "dien_tich")
    private Integer dienTich;

    @Column(name = "suc_chua_lon")
    private Integer sucChuaLon;

    @Column(name = "suc_chua_nho")
    private Integer sucChuaNho;
    @Column(name = "gia_phong")
    private Double giaPhong;

    @Column(name = "mo_ta")
    private String moTa;

    @Column(name = "trang_thai")
    private String trangThai;
}
