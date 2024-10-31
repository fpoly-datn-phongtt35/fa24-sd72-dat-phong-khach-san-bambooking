package com.example.datn.dto.response;

import com.example.datn.model.LoaiPhong;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class TTDPResponse {
    Integer id;
    String maDatPhong;
    String maTTDP;
    String tenKhachHang;
    Integer soNguoi;
    LoaiPhong loaiPhong;
    LocalDate ngayNhanPhong;
    LocalDate ngayTraPhong;
    Double donGia;
}
