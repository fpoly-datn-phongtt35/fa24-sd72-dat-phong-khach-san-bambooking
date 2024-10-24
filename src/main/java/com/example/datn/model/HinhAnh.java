package com.example.datn.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Table(name = "hinh_anh")
@Entity
public class HinhAnh {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @JoinColumn(name = "id_phong")
    @ManyToOne
    @JsonBackReference
    private Phong phong;
    @Column(name = "ten")
    private String tenAnh;
    @Column(name = "duong_dan")
    private String duongDan;
    @Column(name = "trang_thai")
    private Boolean trangThai;
}
