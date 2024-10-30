package com.example.datn.dto.response;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Setter
@Getter
@Data
public class HoaDonResponse {
    Integer id;
    Integer idHoaDon;
    String maHoaDon;
    String hoTenNhanVien;
    String maDatPhong;
    Double tongTien;
    LocalDate ngayTao;
    String trangThai;
}
