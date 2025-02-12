package com.example.datn.dto.response;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.AllArgsConstructor;
@NoArgsConstructor
@Getter
@Setter

public class VatTuLoaiPhongResponse {

    private Integer id;
    private String tenLoaiPhong;
    private String tenVatTu;
    private String hinhAnh;
    private Double gia;
    private Integer soLuong;


    public VatTuLoaiPhongResponse(Integer id, String tenLoaiPhong, String tenVatTu, String hinhAnh, Double gia, Integer soLuong) {

        this.id = id;
        this.tenLoaiPhong = tenLoaiPhong;
        this.tenVatTu = tenVatTu;
        this.hinhAnh = hinhAnh;
        this.gia = gia;
        this.soLuong = soLuong;
    }
}
