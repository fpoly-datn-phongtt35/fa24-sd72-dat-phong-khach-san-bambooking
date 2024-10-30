package com.example.datn.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Setter
@Getter
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class HoaDonRequest {
    String maHoaDon;
    Integer idNhanVien;
    Integer idDatPhong;
    Double tongTien;

}
