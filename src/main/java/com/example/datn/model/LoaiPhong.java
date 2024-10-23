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

    @Column(name = "so_khach_toi_da")
    private Integer soKhachToiDa;

    @Column(name = "don_gia")
    private Double donGia;

    @Column(name = "don_gia_phu_thu")
    private Double donGiaPhuThu;
    @Column(name = "mo_ta")
    private String moTa;
}
