package com.example.datn.dto.request;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class LoaiPhongRequest {
    private Integer id;

    private String tenLoaiPhong;

    private Integer dienTich;

    private Integer soKhachToiDa;

    private Double donGia;

    private Double donGiaPhuThu;
    private String moTa;
}
