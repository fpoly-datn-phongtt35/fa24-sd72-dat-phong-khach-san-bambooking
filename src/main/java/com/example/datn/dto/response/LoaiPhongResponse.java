package com.example.datn.dto.response;

import jakarta.persistence.Column;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class LoaiPhongResponse {
    private Integer id;
    private String tenLoaiPhong;

    private Integer dienTich;

    private Integer sucChuaLon;

    private Integer sucChuaNho;

    private String moTa;

    private String trangThai;

    public LoaiPhongResponse ( Integer id,String tenLoaiPhong,Integer dienTich, Integer sucChuaLon,
                               Integer sucChuaNho,String moTa,String trangThai){
        this.id = id;
        this.tenLoaiPhong = tenLoaiPhong;
        this.dienTich = dienTich;
        this.sucChuaLon = sucChuaLon;
        this.sucChuaNho = sucChuaNho;
        this.moTa = moTa;
        this.trangThai = trangThai;
    }
}
