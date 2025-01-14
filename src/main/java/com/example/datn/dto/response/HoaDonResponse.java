package com.example.datn.dto.response;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Setter
@Getter
@Data
public class HoaDonResponse {
    Integer id;
    String maHoaDon;
    String tenDangNhap;
    String maDatPhong;
    Double tongTien;
    LocalDateTime ngayTao;
    String trangThai;
}
