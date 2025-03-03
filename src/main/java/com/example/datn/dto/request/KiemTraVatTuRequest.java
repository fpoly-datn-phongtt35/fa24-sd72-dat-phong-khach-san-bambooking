package com.example.datn.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class KiemTraVatTuRequest {
    private Integer idVatTu;
    private Integer soLuongThucTe;
    private String tinhTrang;
    private String ghiChu;
}
