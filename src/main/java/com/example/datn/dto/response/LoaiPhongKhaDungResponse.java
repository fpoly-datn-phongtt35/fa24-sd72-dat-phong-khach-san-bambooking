package com.example.datn.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
public class LoaiPhongKhaDungResponse {
    private Integer id;
    private String tenLoaiPhong;
    private String maLoaiPhong;
    private Integer dienTich;
    private Integer soKhachToiDa;
    private Double donGia;
    private Double donGiaPhuThu;
    private String moTa;
    private Long soLuongPhong;
    private Long soPhongKhaDung;

    public LoaiPhongKhaDungResponse(Integer id, String tenLoaiPhong, String maLoaiPhong, Integer dienTich,
                                    Integer soKhachToiDa, Double donGia, Double donGiaPhuThu, String moTa,
                                    Long soLuongPhong, Long soPhongKhaDung) {
        this.id = id;
        this.tenLoaiPhong = tenLoaiPhong;
        this.maLoaiPhong = maLoaiPhong;
        this.dienTich = dienTich;
        this.soKhachToiDa = soKhachToiDa;
        this.donGia = donGia;
        this.donGiaPhuThu = donGiaPhuThu;
        this.moTa = moTa;
        this.soLuongPhong = soLuongPhong;
        this.soPhongKhaDung = soPhongKhaDung;
    }
}
