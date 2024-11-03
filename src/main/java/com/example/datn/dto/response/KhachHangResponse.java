package com.example.datn.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class KhachHangResponse {
    private Integer id;
    private String ho;
    private String ten;
    private String gioiTinh;
    private String diaChi;
    private String sdt;
    private String email;
    private String ngayTao;
    private String ngaySua;
    private Boolean trangThai =true;
}
