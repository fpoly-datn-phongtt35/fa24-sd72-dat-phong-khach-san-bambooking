package com.example.datn.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "kiem_tra_phong")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class KiemTraPhong {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "id_xep_phong")
    private XepPhong xepPhong;

    @ManyToOne
    @JoinColumn(name = "id_nhan_vien")
    private NhanVien nhanVien;

    @Column(name = "thoi_gian_kiem_tra")
    private LocalDateTime thoiGianKiemTra;

    @Column(name = "tinh_trang")
    private String tinhTrang;

    @Column(name = "trang_thai")
    private String trangThai;
}
