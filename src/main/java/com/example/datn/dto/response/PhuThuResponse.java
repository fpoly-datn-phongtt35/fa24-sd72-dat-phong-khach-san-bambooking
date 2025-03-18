package com.example.datn.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PhuThuResponse {
    private String tenPhong;
    private String tenPhuThu;
    private Integer soLuong;
    private Double tienPhuThu;

    public PhuThuResponse(String tenPhong, String tenPhuThu, Integer soLuong, Double tienPhuThu) {
        this.tenPhong = tenPhong;
        this.tenPhuThu = tenPhuThu;
        this.soLuong = soLuong;
        this.tienPhuThu = tienPhuThu;
    }
}
