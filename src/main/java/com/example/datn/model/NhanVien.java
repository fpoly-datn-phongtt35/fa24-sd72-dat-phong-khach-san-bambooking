package com.example.datn.model;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.time.LocalDateTime;


@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Builder
@Table(name = "nhan_vien")
public class NhanVien implements Serializable {
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

    @Transient // Đảm bảo trường này không được ánh xạ trực tiếp với cơ sở dữ liệu
    private String hoTenNhanVien;

    public String getHoTenNhanVien() {
        return ho + " " + ten;
    }

    @Column(name = "gioi_tinh")
    private String gioiTinh;

    @Column(name = "dia_chi")
    private String diaChi;

    @Column(name = "sdt")
    private String sdt;

    @Column(name = "email")
    private String email;
    @Column(name = "ngay_tao")
    private LocalDateTime ngayTao;

    @Column(name = "ngay_sua")
    private LocalDateTime ngaySua;

    @Column(name = "trang_thai")
    private Boolean trangThai;
    @Column(name = "avatar")
    private String avatar;

    @Column(name = "public_id")
    private String public_id;
    public String getHoTen() {
        return ho + " " + ten;
    }
}
