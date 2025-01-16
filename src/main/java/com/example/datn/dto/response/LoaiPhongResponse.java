package com.example.datn.dto.response;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class LoaiPhongResponse {
    private Integer id;
    private String tenLoaiPhong;
    private String maLoaiPhong;
    private Integer dienTich;

    private Integer soKhachToiDa;

    private Double donGia;

    private Double donGiaPhuThu;

    private String moTa;
}
