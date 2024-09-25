package com.example.datn.dto.request;

import com.example.datn.model.HoaDon;
import com.example.datn.model.KhachHang;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class DatPhongRequest {
    private Integer id;
    private HoaDon hoaDon;
    private KhachHang khachHang;
    private String maDatPhong;
    private Integer soLuongPhong;
    private LocalDateTime thoiGianVaoDuKien;
    private LocalDateTime thoiGianRaDuKien;
    private LocalDateTime thoiGianDat;
    private String ghiChu;
    private String trangThai;
}
