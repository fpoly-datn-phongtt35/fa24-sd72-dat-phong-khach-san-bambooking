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
    private Integer idHoaDon;
    private String tenKhachHang;
    private String maDatPhong;
    private Integer soLuongPhong;
    private String thoiGianVaoDuKien;
    private String thoiGianRaDuKien;
    private String thoiGianDat;
    private String ghiChu;
    private String trangThai;

    public DatPhongResponse(Integer id, Integer idHoaDon, String tenKhachHang, String maDatPhong,
                            Integer soLuongPhong, LocalDateTime thoiGianVaoDuKien,
                            LocalDateTime thoiGianRaDuKien, LocalDateTime thoiGianDat,
                            String ghiChu, String trangThai) {
        this.id = id;
        this.idHoaDon = idHoaDon;
        this.tenKhachHang = tenKhachHang;
        this.maDatPhong = maDatPhong;
        this.soLuongPhong = soLuongPhong;
        this.thoiGianVaoDuKien = formatDateTime(thoiGianVaoDuKien);
        this.thoiGianRaDuKien = formatDateTime(thoiGianRaDuKien);
        this.thoiGianDat = formatDateTime(thoiGianDat);
        this.ghiChu = ghiChu;
        this.trangThai = trangThai;
    }

    // Hàm để định dạng LocalDateTime thành chuỗi theo định dạng "hh:mm a dd-M-yyyy"
    private String formatDateTime(LocalDateTime dateTime) {
        if (dateTime == null) {
            return null;
        }
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("hh:mm a dd-M-yyyy");
        return dateTime.format(formatter);
    }
}
