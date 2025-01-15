package com.example.datn.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "thanh_toan")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ThanhToan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;
    @ManyToOne
    @JoinColumn(name = "id_hoa_don")
    HoaDon hoaDon;
    @ManyToOne
    @JoinColumn(name = "id_nhan_vien")
    NhanVien nhanVien;
    @Column(name = "ngay_thanh_toan")
    LocalDateTime ngayThanhToan;
    @Column(name = "tien_thanh_toan")
    Double tienThanhToan;
    @Column(name = "tien_thua")
    Double tienThua;
    @Column(name = "phuong_thuc_thanh_toan")
    Boolean phuongThucThanhToan;
    @Column(name = "ma_qr")
    String maVietQR;
    @Column(name = "trang_thai")
    Boolean trangThai;
}
