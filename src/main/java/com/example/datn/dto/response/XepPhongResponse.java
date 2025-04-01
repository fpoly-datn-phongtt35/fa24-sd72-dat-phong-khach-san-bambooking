package com.example.datn.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class XepPhongResponse {
    private Integer idXepPhong;
    private String hoTenKhachHang;
    private String maDatPhong;
    private String maThongTinDatPhong;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy HH:mm:ss")
    private LocalDateTime ngayNhanPhong;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy HH:mm:ss")
    private LocalDateTime ngayTraPhong;
    private String tenLoaiPhong;
    private String tenPhong;
    private String trangThaiXepPhong;
}
