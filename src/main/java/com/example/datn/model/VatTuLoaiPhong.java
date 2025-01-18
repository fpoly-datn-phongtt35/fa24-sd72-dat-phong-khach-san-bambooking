package com.example.datn.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "vat_tu_loai_phong")

public class VatTuLoaiPhong {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "id_loai_phong")
    private LoaiPhong loaiPhong;

    @JoinColumn(name = "id_vat_tu")
    @ManyToOne
    private VatTu vatTu;
    @Column(name = "so_luong")
    private Integer soLuong;

}
