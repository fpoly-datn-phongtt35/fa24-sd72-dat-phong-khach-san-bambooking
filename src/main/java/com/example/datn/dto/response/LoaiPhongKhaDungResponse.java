package com.example.datn.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class LoaiPhongKhaDungResponse {
    private Integer id;
    private String tenLoaiPhong;
    private Integer dienTich;

    private Integer soKhachToiDa;

    private Double donGia;

    private Double donGiaPhuThu;

    private String moTa;

    private Long soLuongPhong;
    private Long soPhongKhaDung;
}
