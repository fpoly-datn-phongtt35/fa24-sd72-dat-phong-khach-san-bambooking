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
@Table(name = "xep_phong")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class XepPhong {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;
    @ManyToOne
    @JoinColumn(name = "id_phong")
    Phong phong;
    @ManyToOne
    @JoinColumn(name = "id_thong_tin_dat_phong")
    ThongTinDatPhong thongTinDatPhong;
    @Column(name = "ngay_nhan_phong")
    LocalDateTime ngayNhanPhong;
    @Column(name = "ngay_tra_phong")
    LocalDateTime ngayTraPhong;
    @Column(name = "trang_thai")
    Boolean trangThai;
}
