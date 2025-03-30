package com.example.datn.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ChiTietTraPhongResponse {
    String tenPhong;
    LocalDate ngayNhanPhong;
    LocalDateTime ngayTraPhongThucTe;
    String trangThaiKiemTraPhong;
    LocalDateTime thoiGianKiemTraPhong;
}
