package com.example.datn.dto.response;

import com.example.datn.model.HoaDon;
import com.example.datn.model.KhachHang;
import com.example.datn.utilities.DateTimeFormat;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@NoArgsConstructor
@Getter
@Setter
@AllArgsConstructor
public class DatPhongResponse {
    private Integer id;
    private KhachHang khachHang;
    private String maDatPhong;
    private LocalDate ngayDat;
    private Double tongTien;
    private Double datCoc;
    private String ghiChu;
    private String trangThai;

}
