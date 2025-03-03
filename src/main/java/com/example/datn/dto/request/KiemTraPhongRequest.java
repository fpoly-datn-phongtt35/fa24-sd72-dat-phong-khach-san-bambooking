package com.example.datn.dto.request;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class KiemTraPhongRequest {
    private Integer idXepPhong;
    private Integer idNhanVien;
    List<KiemTraVatTuRequest> danhSachVatTu;
}
