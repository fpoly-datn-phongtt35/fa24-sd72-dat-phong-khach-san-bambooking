package com.example.datn.dto.response;

import com.example.datn.model.LoaiPhong;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class PhongResponseDat {
    Integer id;
    String tenLoaiPhong;
    String maPhong;
    String tenPhong;
    Double giaPhong;
    String duongDanAnh;
}
