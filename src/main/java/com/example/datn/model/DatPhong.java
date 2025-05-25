package com.example.datn.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
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
    @ManyToOne
    @JoinColumn(name = "id_khach_hang")
    private KhachHang khachHang;
    @Column(name = "ma_dat_phong")
    private String maDatPhong;
    @Column(name = "so_nguoi")
    private Integer soNguoi;

    @Column(name = "so_tre")
    private Integer soTre;
    @Column(name = "so_phong")
    private Integer soPhong;
    @Column(name = "ngay_dat")
    private LocalDateTime ngayDat;
    @Column(name = "tong_tien")
    private Double tongTien;
    @Column(name = "ghi_chu")
    private String ghiChu;
    @Column(name = "trang_thai")
    private String trangThai;

    public String getFullNameKhachHang() {
        return this.khachHang.getHo()+ " " + this.khachHang.getTen();
    }
}
