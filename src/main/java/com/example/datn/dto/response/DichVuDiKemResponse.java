package com.example.datn.dto.response;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class DichVuDiKemResponse {
    private Integer id;
    private String tenDichVu;
    private String tenLoaiPhong;
    private Boolean trangThai;

    public DichVuDiKemResponse(Integer id, String tenDichVu, String tenLoaiPhong, Boolean trangThai) {
        this.id = id;
        this.tenDichVu = tenDichVu; // Sửa lại gán đúng
        this.tenLoaiPhong = tenLoaiPhong;
        this.trangThai = trangThai;
    }
}
