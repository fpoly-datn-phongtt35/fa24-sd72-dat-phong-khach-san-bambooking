package com.example.datn.service;

import java.time.LocalDateTime;

public interface EmailService {
    void sendThankYouEmail(String email,
                           String fullName,
                           String loaiPhong,
                           Double giaDat,
                           LocalDateTime ngayNhanPhong,
                           LocalDateTime ngayTraPhong,
                           LocalDateTime ngayDatPhong,
                           String maThongTinDatPhong,
                           long soDem,
                           Double tienPhuThu,
                           Double tongTien);
}
