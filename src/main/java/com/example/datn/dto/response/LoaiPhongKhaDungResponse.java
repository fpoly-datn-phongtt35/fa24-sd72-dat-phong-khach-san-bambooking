package com.example.datn.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class LoaiPhongKhaDungResponse {
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
    private Long soLuongPhong;
    private Long soPhongKhaDung;
}
