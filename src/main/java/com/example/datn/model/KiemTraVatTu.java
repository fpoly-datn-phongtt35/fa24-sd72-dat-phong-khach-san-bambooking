package com.example.datn.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "kiem_tra_vat_tu")
public class KiemTraVatTu {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "id_kiem_tra_phong")
    private KiemTraPhong kiemTraPhong;

    @ManyToOne
    @JoinColumn(name = "id_vat_tu")
    private VatTu vatTu;

    @Column(name = "so_luong")
    private Integer soLuong;

    @Column(name = "tinh_trang")
    private String tinhTrang;

    @Column(name = "ghi_chu")
    private String ghiChu;

}
