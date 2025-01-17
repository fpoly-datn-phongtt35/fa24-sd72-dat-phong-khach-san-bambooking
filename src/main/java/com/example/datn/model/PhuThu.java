package com.example.datn.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "phu_thu")
public class PhuThu {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "id_xep_phong")
    XepPhong xepPhong;

    @Column(name = "ten_phu_thu")
    private String tenPhuThu;

    @Column(name = "tien_phu_thu")
    private Double tienPhuThu;

    @Column(name = "so_luong")
    Integer soLuong;

    @Column(name = "trang_thai")
    private Boolean trangThai;

}
