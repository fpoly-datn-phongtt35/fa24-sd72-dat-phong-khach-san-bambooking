package com.example.datn.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class VatTuRequest {
    private Integer id;
    private String tenVatTu;
    private Double gia;
    private String hinhAnh;
}
