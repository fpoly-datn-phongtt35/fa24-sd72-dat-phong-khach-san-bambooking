package com.example.datn.dto.request;

import com.example.datn.model.KhachHang;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class DatPhongRequest {
    private Integer id;
    private KhachHang khachHang;
    private String maDatPhong;
    private Integer soNguoi;
    private Integer soPhong;
    private LocalDateTime ngayDat;
    private Double tongTien;
    private String ghiChu;
    private String trangThai;
}
