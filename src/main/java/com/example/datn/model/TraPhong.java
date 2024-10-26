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
@Table(name = "tra_phong")
public class TraPhong {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @JoinColumn(name = "id_xep_phong")
    @ManyToOne
    private XepPhong xepPhong;
    @Column(name = "ngay_tra_phong_thuc_te")
    private LocalDateTime ngayTraPhongThucTe;
    @Column(name = "trang_thai")
    private Boolean trangThai;
}
