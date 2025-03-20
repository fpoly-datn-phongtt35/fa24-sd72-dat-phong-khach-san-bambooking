package com.example.datn.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class KiemTraVatTuResponseList {
    private String tenPhong;
    private String tenVatTu;
    private Double donGia;
    private Integer soLuongThieu;
    private Double tienKhauTru;

    public KiemTraVatTuResponseList(String tenPhong, String tenVatTu, Double donGia, Integer soLuongThieu, Double tienKhauTru) {
        this.tenPhong = tenPhong;
        this.tenVatTu = tenVatTu;
        this.donGia = donGia;
        this.soLuongThieu = soLuongThieu;
        this.tienKhauTru = tienKhauTru;
    }
}


