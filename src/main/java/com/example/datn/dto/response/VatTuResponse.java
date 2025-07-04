package com.example.datn.dto.response;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class VatTuResponse {
    private Integer id;
    private String tenVatTu;
    private String hinhAnh;
    private Double gia;
    private Boolean trangThai;

    public VatTuResponse(Integer id, String tenVatTu, String hinhAnh, Double gia, Boolean trangThai) {
        this.id = id;
        this.tenVatTu = tenVatTu;
        this.hinhAnh = hinhAnh;
        this.gia = gia;
        this.trangThai= trangThai;
    }
}
