package com.example.datn.dto.response.datphong;

import com.example.datn.dto.response.LoaiPhongKhaDungResponse;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class LoaiPhongChon {
    private LoaiPhongKhaDungResponse loaiPhong;
    private int soLuongChon;
}
