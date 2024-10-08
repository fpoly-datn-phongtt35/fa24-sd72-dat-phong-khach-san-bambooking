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
@Table(name = "phong")

public class Phong {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @JoinColumn(name = "id_loai_phong")
    @ManyToOne
    private LoaiPhong loaiPhong;
    @Column(name = "ma_phong")
    private String maPhong;
    @Column(name = "ten_phong")
    private String tenPhong;
    @Column(name = "gia_phong")
    private Double giaPhong;
    @Column(name = "tinh_trang")
    private String tinhTrang;
    @Column(name = "trang_thai")
    private String trangThai;
}
