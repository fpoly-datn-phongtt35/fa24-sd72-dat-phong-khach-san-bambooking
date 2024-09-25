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
@Table(name = "tien_ich_phong")

public class TienIchPhong {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "id_loai_phong")
    private LoaiPhong loaiPhong;

    @JoinColumn(name = "id_tien_ich")
    @ManyToOne
    private TienIch tienIch;

}
