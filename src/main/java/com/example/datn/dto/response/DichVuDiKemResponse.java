package com.example.datn.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class DichVuDiKemResponse {
    private Integer id;
    private String tenDichVu;
    private String tenLoaiPhong;
    private Integer soLuong;
    private Boolean trangThai;


}
