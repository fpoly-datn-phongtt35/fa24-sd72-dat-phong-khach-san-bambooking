package com.example.datn.dto.request;

import jakarta.persistence.Column;
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
    private String maLoaiPhong;
    private Integer dienTich;
    private Integer soKhachTieuChuan;
    private Integer soKhachToiDa;
    private Integer treEmTieuChuan;
    private Integer treEmToiDa;
    private Double donGia;
    private Double phuThuNguoiLon;
    private Double phuThuTreEm;
    private String moTa;
    private Boolean trangThai;
}
