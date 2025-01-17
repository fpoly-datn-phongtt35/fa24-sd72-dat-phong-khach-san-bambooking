package com.example.datn.dto.response;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Data
public class HoaDonResponse {
    Integer id;
    String maHoaDon;
    String tenDangNhap;
    String tenNhanVien;
    String maDatPhong;
    Double tongTien;
    String ngayTao;
    String trangThai;
}
