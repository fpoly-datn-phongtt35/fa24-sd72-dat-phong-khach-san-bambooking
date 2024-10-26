package com.example.datn.dto.request;

import com.example.datn.model.DatPhong;
import com.example.datn.model.NhanVien;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Setter
@Getter
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class HoaDonRequest {
    String maHoaDon;
    NhanVien nhanVien;
    DatPhong datPhong;
    Double tongTien;
    LocalDate ngayTao;
    String trangThai;
}
