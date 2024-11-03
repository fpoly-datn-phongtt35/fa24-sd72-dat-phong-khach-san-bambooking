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
@Table(name = "hoa_don")
public class HoaDon {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @ManyToOne
    @JoinColumn(name = "id_nhan_vien")
    private NhanVien nhanVien;
    @ManyToOne
    @JoinColumn(name = "id_dat_phong")
    private DatPhong datPhong;
    @Column(name = "ma_hoa_don")
    private String maHoaDon;
    @Column(name = "tong_tien")
    private Double tongTien;
    @Column(name = "ngay_tao")
    private LocalDate ngayTao;
    @Column(name = "trang_thai")
    private String trangThai;
    public String getHoTenNhanVien() {
        return nhanVien != null ? nhanVien.getHoTen() : "Chưa có thông tin nhân viên";
    }
}
