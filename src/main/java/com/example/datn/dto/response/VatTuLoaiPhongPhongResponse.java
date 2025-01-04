package com.example.datn.dto.response;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class VatTuLoaiPhongPhongResponse {
    private Integer id;
    private String tenLoaiPhong;
    private String tenTienIch;
    private String hinhAnh;

    public VatTuLoaiPhongPhongResponse(Integer id, String tenTienIch, String hinhAnh, String tenLoaiPhong){
        this.id = id;
        this.tenLoaiPhong = tenLoaiPhong;
        this.tenTienIch = tenTienIch;
        this.hinhAnh = hinhAnh;
    }
}
