package com.example.datn.dto.request;

import com.example.datn.model.DichVu;
import com.example.datn.model.LoaiPhong;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class DichVuDikemRequest {
    private Integer id;
    private DichVu dichVu;
    private LoaiPhong loaiPhong;
    private Boolean trangThai;
}
