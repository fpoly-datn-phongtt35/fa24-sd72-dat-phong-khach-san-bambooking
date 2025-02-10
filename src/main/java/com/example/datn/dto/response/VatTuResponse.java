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
    private Double gia;
    private String hinhAnh;

    public VatTuResponse(Integer id, String tenTienIch, String hinhAnh){
        this.id = id;
        this.tenVatTu = tenVatTu;
        this.gia= gia;
        this.hinhAnh = hinhAnh;
    }
}
