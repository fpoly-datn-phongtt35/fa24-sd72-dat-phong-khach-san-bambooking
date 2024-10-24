package com.example.datn.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class HinhAnhRequest {
    private Integer idPhong;
    @NotBlank(message = "Tên ảnh không được trống!")
    private String tenAnh;
    @NotBlank(message = "Đường dẫn không được trống!")
    private String duongDan;
    @NotBlank(message = "Trạng thái không được để trống!")
    private Boolean trangThai;
}
