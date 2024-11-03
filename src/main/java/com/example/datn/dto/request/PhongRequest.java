package com.example.datn.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
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
    @Size(max = 255, message = "Mã phòng không được vượt quá 255 ký tự!")
    String maPhong;

    @NotBlank(message = "Tên phòng không được để trống!")
    @Size(max = 255, message = "Tên phòng không được vượt quá 255 ký tự!")
    String tenPhong;


    @NotBlank(message = "Tình trạng không được để trống!")
    String tinhTrang;

//    @NotBlank(message = "Vui lòng chọn trạng thái!")
    Boolean trangThai;
}
