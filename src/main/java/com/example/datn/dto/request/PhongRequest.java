package com.example.datn.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PhongRequest {
    @NotNull(message = "ID loại phòng không được để trống!")
    Integer idLoaiPhong;
    @NotBlank(message = "Mã phòng không được để trống!")
    String maPhong;
    @NotBlank(message = "Tên phòng không được để trống!")
    String tenPhong;
    @NotBlank(message = "Tình trạng không được để trống!")
    String tinhTrang;
    @NotBlank(message = "Trạng thái không được để trống!")
    String trangThai;
}
