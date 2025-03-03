package com.example.datn.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class KiemTraVatTuResponse {
    private Integer idVatTu;
    private String tenVatTu;
    private Integer soLuongThucTe;
    private String tinhTrang;
    private Double donGia;
    private String ghiChu;
}
