package com.example.datn.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class KhachHangDatPhongRequest {
    private Integer id;
    private String cccd;
    private String ho;
    private String ten;
    private String sdt;
    private String email;
    private String gioiTinh;
    private String diaChi;
    private Boolean trangThai;
}
