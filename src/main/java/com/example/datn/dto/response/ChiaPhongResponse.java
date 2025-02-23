package com.example.datn.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ChiaPhongResponse {
    private Integer loaiPhongId;
    private String tenLoaiPhong;
    private Integer soPhongCan;
    private Integer soKhachToiDa;
    private Double tongGiaTien;
}
