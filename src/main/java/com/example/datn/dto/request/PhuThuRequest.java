package com.example.datn.dto.request;

import com.example.datn.model.XepPhong;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class PhuThuRequest {
    private Integer id;
    private XepPhong xepPhong;
    private String tenPhuThu;
    private Double tienPhuThu;
    private Integer soLuong;
    private Boolean trangThai;

}
