package com.example.datn.dto.request;

import com.example.datn.model.VaiTro;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class NhanVienRequest {
    private String ho;
    private String ten;
    private String gioiTinh;
    private String diaChi;
    private String sdt;
    private String email;
    private LocalDate ngayTao;
    private LocalDate ngaySua;
    private boolean trangThai;
    private VaiTro vaiTro;
}
