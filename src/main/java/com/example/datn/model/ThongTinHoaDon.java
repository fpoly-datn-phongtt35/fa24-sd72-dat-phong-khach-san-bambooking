package com.example.datn.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "thong_tin_hoa_don")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ThongTinHoaDon {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;
    @ManyToOne
    @JoinColumn(name = "id_tra_phong")
    TraPhong traPhong;
    @ManyToOne
    @JoinColumn(name = "id_hoa_don")
    HoaDon hoaDon;
    @Column(name = "tien_dich_vu")
    Double tienDichVu;
    @Column(name = "tien_phong")
    Double tienPhong;
    @Column(name = "tien_phu_thu")
    Double tienPhuThu;
}
