package com.example.datn.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DatCocThanhToanRequest {
    private Integer idDatPhong;
    private String loaiThanhToan;
}
