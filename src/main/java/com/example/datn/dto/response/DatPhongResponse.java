package com.example.datn.dto.response;

import com.example.datn.model.HoaDon;
import com.example.datn.model.KhachHang;
import com.example.datn.utilities.DateTimeFormat;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@NoArgsConstructor
@Getter
@Setter

public class DatPhongResponse {
    private Integer id;
    private String tenNhanVien;
    private String tenKhachHang;
    private String maDatPhong;
    private String ngayDat;
    private String ghiChu;
    private String trangThai;

    public DatPhongResponse(Integer id, String tenNhanVien, String tenKhachHang, String maDatPhong,
                            LocalDateTime ngayDat, String ghiChu, String trangThai) {
        this.id = id;
        this.tenNhanVien = tenNhanVien;
        this.tenKhachHang = tenKhachHang;
        this.maDatPhong = maDatPhong;
        this.ngayDat = formatDateTime(ngayDat);
        this.ghiChu = ghiChu;
        this.trangThai = trangThai;
    }

    private String formatDateTime(LocalDateTime dateTime) {
        if (dateTime == null) {
            return null;
        }
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("hh:mm a dd-M-yyyy");
        return dateTime.format(formatter);
    }
}
