package com.example.datn.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
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
    @ManyToOne
    private DatPhong datPhong;
    @ManyToOne
    @JoinColumn(name = "id_loai_phong")
    private LoaiPhong loaiPhong;
    @Column(name = "ma_thong_tin_dat_phong")
    private String maThongTinDatPhong;
    @Column(name = "ngay_nhan_phong")
    private LocalDate ngayNhanPhong;
    @Column(name = "ngay_tra_phong")
    private LocalDate ngayTraPhong;
    @Column(name = "so_nguoi")
    private Integer soNguoi;
    @Column(name = "gia_dat")
    private Double giaDat;
    @Column(name = "trang_thai")
    private String trangThai;

}
