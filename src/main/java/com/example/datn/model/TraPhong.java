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
@Table(name = "tra_phong")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TraPhong {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;
    @JoinColumn(name = "id_xep_phong")
    @ManyToOne
    XepPhong xepPhong;
    @Column(name = "ngay_tra_phong_thuc_te")
    LocalDateTime ngayTraThucTe;
    @Column(name = "trang_thai")
    Boolean trangThai;
}
