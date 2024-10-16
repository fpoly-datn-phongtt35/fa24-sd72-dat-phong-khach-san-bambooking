package com.example.datn.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ThongTinNhanVienRequest {
    private String ho;
    private String ten;
    private String gioiTinh;
    private String diaChi;
    private String sdt;
    private String email;
}
