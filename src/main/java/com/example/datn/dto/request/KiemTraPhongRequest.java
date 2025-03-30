package com.example.datn.dto.request;

import jakarta.validation.Valid;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class KiemTraPhongRequest {
    private Integer idXepPhong;
    private Integer idNhanVien;
    @Valid
    List<KiemTraVatTuRequest> danhSachVatTu;
}
