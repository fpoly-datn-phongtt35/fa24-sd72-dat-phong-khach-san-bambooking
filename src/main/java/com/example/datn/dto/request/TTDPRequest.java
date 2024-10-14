package com.example.datn.dto.request;

import com.example.datn.model.DatPhong;
import com.example.datn.model.Phong;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

import java.time.LocalDateTime;

public class TTDPRequest {
    private Integer id;
    private DatPhong datPhong;
    private Phong phong;
    private String maThongTinDatPhong;
    private LocalDateTime ngayNhanPhong;
    private LocalDateTime ngayTraPhong;
    private Double giaDat;
    private Integer soNguoi;
    private String trangThai;
}
