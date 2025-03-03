package com.example.datn.dto.response;

import lombok.*;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class VatTuResponseByNVT {
    private Integer id;
    private String tenVatTu;
    private Double donGia;
    private Integer soLuongTieuChuan;
}
