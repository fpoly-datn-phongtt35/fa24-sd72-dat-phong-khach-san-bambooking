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
@Table(name = "thong_tin_dat_phong")

public class ThongTinDatPhong {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @JoinColumn(name = "id_dat_phong")
    @ManyToOne()
    private DatPhong datPhong;

    @ManyToOne
    @JoinColumn(name = "id_phong")
    private Phong phong;


    @Column(name = "ngay_nhan_phong")
    private LocalDateTime ngayNhanPhong;

    @Column(name = "ngay_tra_phong")
    private LocalDateTime ngayTraPhong;


    @Column(name = "so_nguoi")
    private Integer soNguoi;
    @Column(name = "tien_phong")
    private Double tienPhong;

    @Column(name = "tien_dich_vu")
    private Double tienDichVu;

    @Column(name = "trang_thai")
    private String trangThai;
}
