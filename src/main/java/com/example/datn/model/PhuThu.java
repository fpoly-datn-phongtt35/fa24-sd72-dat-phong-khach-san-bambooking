package com.example.datn.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "phu_thu")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class PhuThu {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @JoinColumn(name = "xep_phong")
    @ManyToOne
    private XepPhong xepPhong;
    @Column(name = "ten_phu_thu")
    private String tenPhuThu;
    @Column(name = "tien_phu_thu")
    private Double tienPhuThu;
    @Column(name = "so_luong")
    private Integer soLuong;
    @Column(name = "trang_thai")
    private Boolean trangThai;
}
