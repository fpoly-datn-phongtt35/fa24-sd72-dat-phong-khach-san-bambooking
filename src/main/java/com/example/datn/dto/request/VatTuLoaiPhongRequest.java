package com.example.datn.dto.request;

import com.example.datn.model.LoaiPhong;
import com.example.datn.model.VatTu;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class VatTuLoaiPhongRequest {
    private Integer id;
    private LoaiPhong loaiPhong;
    private VatTu vatTu;

    private Integer soLuong;
}
