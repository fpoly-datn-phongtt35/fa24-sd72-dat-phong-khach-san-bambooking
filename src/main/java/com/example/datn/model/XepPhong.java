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
@Table(name = "xep_phong")
public class XepPhong {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @JoinColumn(name = "id_phong")
    @ManyToOne
    private Phong phong;

    @JoinColumn(name = "id_thong_tin_dat_phong")
    @ManyToOne
    private ThongTinDatPhong thongTinDatPhong;
    @Column(name = "ngay_nhan_phong")
    private LocalDateTime ngayNhanPhong;
    @Column(name = "ngay_tra_phong")
    private LocalDateTime ngayTraPhong;
    @Column(name = "trang_thai")
    private Boolean trangThai;
}
