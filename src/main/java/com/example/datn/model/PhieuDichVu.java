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
@Table(name = "phieu_dich_vu")
public class PhieuDichVu {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "id_dich_vu")
    private DichVu dichVu;

    @ManyToOne
    @JoinColumn(name = "id_thong_tin_dat_phong")
    private ThongTinDatPhong thongTinDatPhong;

    @Column(name = "so_luong_su_dung")
    private Integer soLuongSuDung;

    @Column(name = "ngay_bat_dau")
    private LocalDateTime ngayBatDau;

    @Column(name = "ngay_ket_thuc")
    private LocalDateTime ngayKetThuc;

    @Column(name = "thanh_tien")
    private Double thanhTien;
    @Column(name = "trang_thai")
    private String trangThai;
}
