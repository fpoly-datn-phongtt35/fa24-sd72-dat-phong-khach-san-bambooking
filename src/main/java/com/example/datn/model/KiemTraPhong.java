package com.example.datn.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "kiem_tra_phong")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class KiemTraPhong {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @JoinColumn(name = "tra_phong")
    @ManyToOne
    private TraPhong traPhong;
    @Column(name = "ten_vat_tu")
    private String tenVatTu;
    @Column(name = "so_luong")
    private Integer soLuong;
    @Column(name = "trang_thai")
    private Boolean trangThai;
}
