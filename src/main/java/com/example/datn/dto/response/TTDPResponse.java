package com.example.datn.dto.response;

import com.example.datn.model.LoaiPhong;
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
public class TTDPResponse {
    Integer id;
    String maDatPhong;
    String maThongTinDatPhong;
    String tenKhachHang;
    Integer soNguoi;
    LoaiPhong loaiPhong;
    LocalDateTime ngayNhanPhong;
    LocalDateTime ngayTraPhong;
    Double giaDat;
    String ghiChu;
    String trangThai;
}
