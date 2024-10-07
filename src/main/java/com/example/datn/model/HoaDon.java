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
    @JoinColumn(name = "id_tai_khoan")
    private TaiKhoan taiKhoan;

    @Column(name = "tong_tien")
    private Double tongTien;

    @Column(name = "phuong_thuc_thanh_toan")
    private String phuongThucThanhToan;

    @Column(name = "ngay_thanh_toan")
    private LocalDate ngayThanhToan;

    @Column(name = "trang_thai")
    private String trangThai;
}
