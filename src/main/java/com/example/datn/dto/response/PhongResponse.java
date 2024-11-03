package com.example.datn.dto.response;

import com.example.datn.model.LoaiPhong;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)

public class PhongResponse {
    Integer id;
    LoaiPhong loaiPhong;
    String maPhong;
    String tenPhong;

    String tinhTrang;
    Boolean trangThai;
    String duongDanAnh;
}
