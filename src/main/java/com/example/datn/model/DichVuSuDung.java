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
@Table(name = "dich_vu_su_dung")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DichVuSuDung {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;
    @ManyToOne
    @JoinColumn(name = "id_dich_vu")
    DichVu dichVu;
    @ManyToOne
    @JoinColumn(name = "id_xep_phong")
    XepPhong xepPhong;
    @Column(name = "so_luong_su_dung")
    Integer soLuongSuDung;
    @Column(name = "ngay_bat_dau")
    LocalDateTime ngayBatDau;
    @Column(name = "ngay_ket_thuc")
    LocalDateTime ngayKetThuc;
    @Column(name = "gia_su_dung")
    Double giaSuDung;
    @Column(name = "trang_thai")
    Boolean trangThai;

}
