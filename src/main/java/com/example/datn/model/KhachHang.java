package com.example.datn.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;


@AllArgsConstructor
@NoArgsConstructor
@Getter
@Builder
@Setter
@Entity
@Table(name = "khach_hang")
public class KhachHang {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @JoinColumn(name = "id_tai_khoan")
    @ManyToOne
    private TaiKhoan taiKhoan;
    @Column(name = "cmnd")
    private String cmnd;
    @Column(name = "ho")
    private String ho;
    @Column(name = "ten")
    private String ten;
    @Column(name = "gioi_tinh")
    private String gioiTinh;
    @Column(name = "dia_chi")
    private String diaChi;
    @Column(name = "sdt")
    private String sdt;
    @Column(name = "email", unique = true, nullable = false)
    private String email;
    @Column(name = "ngay_tao")
    private LocalDateTime ngayTao;
    @Column(name = "ngay_sua")
    private LocalDateTime ngaySua;
    @Column(name = "trang_thai")
    private boolean trangThai;

}
