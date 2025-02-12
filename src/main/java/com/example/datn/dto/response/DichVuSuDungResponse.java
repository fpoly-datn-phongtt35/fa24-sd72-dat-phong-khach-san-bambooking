package com.example.datn.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class DichVuSuDungResponse {
    String tenDichVu;
    Double giaDichVu;
    Integer soLuongSuDung;
    String tenPhong;
    Double tongTien;

    public DichVuSuDungResponse(String tenPhong, String tenDichVu, Double giaDichVu, Integer soLuongSuDung) {
        this.tenPhong = tenPhong;
        this.tenDichVu = tenDichVu;
        this.giaDichVu = giaDichVu;
        this.soLuongSuDung = soLuongSuDung;
        this.tongTien = giaDichVu * soLuongSuDung;
    }
}
