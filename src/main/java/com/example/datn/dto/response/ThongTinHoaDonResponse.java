package com.example.datn.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ThongTinHoaDonResponse {
    Integer id;
    Integer idTraPhong;
    Integer idHoaDon;
    Double tienDichVu;
    Double tienPhong;
    Double tienPhuThu;
    String tenPhong;

    String ngayNhanPhong;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    String ngayTraPhong;
    Double giaPhong;
    Double tienKhauTru;
}
