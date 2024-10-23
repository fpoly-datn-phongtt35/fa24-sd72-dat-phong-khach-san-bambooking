package com.example.datn.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class HinhAnhResponse {
    private Integer id;
    private Integer idPhong;
    private String tenPhong;
    private String tenAnh;
    private String duongDan;
    private Boolean trangThai;
}
