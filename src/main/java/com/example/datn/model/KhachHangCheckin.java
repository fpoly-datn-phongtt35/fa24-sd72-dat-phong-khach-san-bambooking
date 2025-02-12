package com.example.datn.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "khach_hang_checkin")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class KhachHangCheckin {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "id_thong_tin_dat_phong")
    private ThongTinDatPhong thongTinDatPhong;

    @ManyToOne
    @JoinColumn(name = "id_khach_hang")
    private KhachHang khachHang;

    @Column(name = "trang_thai")
    private Boolean trangThai;
}
