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
    @NotNull(message = "Vui lòng chọn loại phòng!")
    Integer idLoaiPhong;
    @NotBlank(message = "Mã phòng không được để trống!")
    String maPhong;
    @NotBlank(message = "Tên phòng không được để trống!")
    String tenPhong;
    @NotNull(message = "Giá phòng không được để trống!")
    Double giaPhong;
    @NotBlank(message = "Tình trạng không được để trống!")
    String tinhTrang;
    @NotBlank(message = "Vui lòng chọn trạng thái!")
    String trangThai;
}
