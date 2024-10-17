package com.example.datn.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class LoaiPhongRequest {
    private Integer id;
    private String tenLoaiPhong;

    private Integer dienTich;

    private Integer sucChuaLon;

    private Integer sucChuaNho;

    private String moTa;

    private String trangThai;
}
