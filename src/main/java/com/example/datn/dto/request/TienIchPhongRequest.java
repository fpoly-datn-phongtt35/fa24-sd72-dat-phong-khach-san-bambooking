package com.example.datn.dto.request;

import com.example.datn.model.LoaiPhong;
import com.example.datn.model.TienIch;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class TienIchPhongRequest {
    private Integer id;
    private LoaiPhong loaiPhong;
    private TienIch tienIch;
}
